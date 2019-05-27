import { channel, delay } from "redux-saga";
import { Effect, fork, put, take } from "redux-saga/effects";

import { SignInUserErrorMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { REDIRECT_CHANNEL_WATCH_DELAY } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { STORAGE_JWT_KEY } from "../../lib/persistence/JwtObjectStorage";
import { USER_JWT_KEY as USER_KEY } from "../../lib/persistence/UserStorage";
import {
  SignerRejectConfirmationError,
  SignerTimeoutError,
} from "../../lib/web3/Web3Manager/Web3Manager";
import { assertNever } from "../../utils/assertNever";
import { actions, TAction } from "../actions";
import { EInitType } from "../init/reducer";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { verifyUserEmail } from "./email/sagas";
import { handleJwtTimeout } from "./jwt/sagas";
import { ELogoutType, EUserAuthType } from "./types";
import { setUser, signInUser } from "./user/sagas";

function* handleLogOutUser(
  { web3Manager, jwtStorage, logger, userStorage }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "AUTH_LOGOUT") return;

  const { userType, logoutType = ELogoutType.USER_REQUESTED } = action.payload;

  userStorage.clear();
  jwtStorage.clear();

  yield web3Manager.unplugPersonalWallet();

  yield put(actions.web3.personalWalletDisconnected());

  switch (logoutType) {
    case ELogoutType.USER_REQUESTED:
      {
        if (userType === EUserType.ISSUER) {
          yield put(actions.routing.goEtoHome());
        } else {
          yield put(actions.routing.goHome());
        }
      }
      break;
    case ELogoutType.SESSION_TIMEOUT:
      if (userType === EUserType.ISSUER) {
        yield put(actions.routing.goToEtoLogin());
      } else {
        yield put(actions.routing.goToLogin());
      }
      break;
    case ELogoutType.ALREADY_LOGGED_IN:
      // no action is required
      break;
    default:
      assertNever(logoutType);
  }

  yield put(actions.init.start(EInitType.APP_INIT));

  logger.setUser(null);
}

function* handleSignInUser({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(signInUser);
  } catch (e) {
    logger.error("User Sign in error", e);

    if (e instanceof SignerRejectConfirmationError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED),
        ),
      );
    } else if (e instanceof SignerTimeoutError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT),
        ),
      );
    } else {
      yield put(actions.auth.logout());
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE),
        ),
      );
    }
  }
}

/**
 * Multi browser logout/login feature
 */
const redirectChannel = channel<{ type: EUserAuthType }>();

/**
 * Saga that starts an Event Channel Emitter that listens to storage
 * events from the browser
 */
export function* startRedirectChannel(): any {
  window.addEventListener("storage", (evt: StorageEvent) => {
    if (evt.key === STORAGE_JWT_KEY && evt.oldValue && !evt.newValue) {
      redirectChannel.put({
        type: EUserAuthType.LOGOUT,
      });
    }
    if (evt.key === USER_KEY && !evt.oldValue && evt.newValue) {
      redirectChannel.put({
        type: EUserAuthType.LOGIN,
      });
    }
  });
}

/**
 * Saga that watches events coming from redirectChannel and
 * dispatches login/logout actions
 */
export function* watchRedirectChannel(): any {
  yield startRedirectChannel();
  while (true) {
    const userAction = yield take(redirectChannel);
    switch (userAction.type) {
      case EUserAuthType.LOGOUT:
        yield put(actions.auth.logout());
        break;
      case EUserAuthType.LOGIN:
        yield put(actions.init.start(EInitType.APP_INIT));
        break;
    }
    yield delay(REDIRECT_CHANNEL_WATCH_DELAY);
  }
}

export function* authSagas(): Iterator<Effect> {
  yield fork(watchRedirectChannel);

  yield fork(neuTakeLatest, "AUTH_LOGOUT", handleLogOutUser);
  yield fork(neuTakeEvery, "AUTH_SET_USER", setUser);
  yield fork(neuTakeEvery, "AUTH_VERIFY_EMAIL", verifyUserEmail);
  yield fork(neuTakeEvery, "WALLET_SELECTOR_CONNECTED", handleSignInUser);
  yield fork(neuTakeLatest, "AUTH_LOAD_JWT", handleJwtTimeout);
}
