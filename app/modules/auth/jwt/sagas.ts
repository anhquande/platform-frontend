import { channel, delay } from "redux-saga";
import { call, Effect, put, select, take } from "redux-saga/effects";

import { calculateTimeLeft } from "../../../components/shared/utils";
import { TMessage } from "../../../components/translatedMessages/utils";
import { REDIRECT_CHANNEL_WATCH_DELAY } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { ICreateJwtEndpointResponse } from "../../../lib/api/SignatureAuthApi";
import { STORAGE_JWT_KEY } from "../../../lib/persistence/JwtObjectStorage";
import { EthereumAddressWithChecksum } from "../../../types";
import { getJwtExpiryDate, hasValidPermissions } from "../../../utils/JWTUtils";
import { EDelayTiming, safeDelay } from "../../../utils/safeDelay";
import { accessWalletAndRunEffect } from "../../access-wallet/sagas";
import { actions } from "../../actions";
import { EInitType } from "../../init/reducer";
import { neuCall } from "../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../web3/selectors";
import { JwtNotAvailable, MessageSignCancelledError } from "../errors";
import { selectJwt } from "../selectors";
import { USER_JWT_KEY as USER_KEY } from "./../../../lib/persistence/UserStorage";

enum EUserAuthType {
  LOGOUT = "LOGOUT",
  LOGIN = "LOGIN",
}

/**
 * Load to store jwt from browser storage
 */
export function* loadJwt({ jwtStorage }: TGlobalDependencies): Iterator<Effect> {
  const jwt = jwtStorage.get();

  if (jwt) {
    yield put(actions.auth.loadJWT(jwt));

    return jwt;
  }
}

/**
 * Save current jwt to browser storage
 */
function* setJwt({ jwtStorage }: TGlobalDependencies, jwt: string): Iterator<Effect> {
  jwtStorage.set(jwt);

  yield put(actions.auth.loadJWT(jwt));
}

function* signChallenge(
  { web3Manager, signatureAuthApi, cryptoRandomString, logger }: TGlobalDependencies,
  permissions: Array<string> = [],
): Iterator<any> {
  const address: EthereumAddressWithChecksum = yield select(selectEthereumAddressWithChecksum);

  const salt = cryptoRandomString(64);

  if (!web3Manager.personalWallet) {
    throw new Error("Wallet unavailable Error");
  }

  const signerType = web3Manager.personalWallet.getSignerType();

  logger.info("Obtaining auth challenge from api");

  const {
    body: { challenge },
  } = yield signatureAuthApi.challenge(address, salt, signerType, permissions);

  logger.info("Signing challenge");

  const signedChallenge = yield web3Manager.personalWallet.signMessage(challenge);

  logger.info("Challenge signed");

  return {
    challenge,
    signedChallenge,
    signerType,
  };
}
/**
 * Obtain new JWT from the authentication server.
 */
export function* obtainJWT(
  { signatureAuthApi, logger }: TGlobalDependencies,
  permissions: Array<string> = [],
): Iterator<any> {
  logger.info("Creating jwt");

  const { signedChallenge, challenge, signerType } = yield neuCall(signChallenge, permissions);

  logger.info("Sending signed challenge back to api");

  const response: ICreateJwtEndpointResponse = yield signatureAuthApi.createJwt(
    challenge,
    signedChallenge,
    signerType,
  );

  yield neuCall(setJwt, response.jwt);

  logger.info("Jwt escalated successfully");
}

/**
 * Obtain new JWT from the authentication server.
 */
export function* escalateJwt(
  { signatureAuthApi, logger }: TGlobalDependencies,
  permissions: Array<string> = [],
): Iterator<any> {
  const currentJwt = yield select(selectJwt);
  if (!currentJwt) {
    throw new JwtNotAvailable();
  }

  logger.info("Escalating jwt");

  const { signedChallenge, challenge, signerType } = yield neuCall(signChallenge, permissions);

  logger.info("Sending signed challenge back to api");

  // TODO: check whether we can omit existing permissions
  const response: ICreateJwtEndpointResponse = yield signatureAuthApi.escalateJwt(
    challenge,
    signedChallenge,
    signerType,
  );

  yield neuCall(setJwt, response.jwt);

  logger.info("Jwt escalated successfully");
}

export function* refreshJWT({
  signatureAuthApi,
  logger,
}: TGlobalDependencies): Iterator<any> {
  logger.info("Refreshing jwt");

  const { jwt }: ICreateJwtEndpointResponse = yield signatureAuthApi.refreshJwt();

  yield neuCall(setJwt, jwt);
}

/**
 * Saga to ensure all the needed permissions are present and still valid on the current jwt
 * If needed permissions are not present/valid will escalate permissions with authentication server
 */
export function* ensurePermissionsArePresentAndRunEffect(
  { logger }: TGlobalDependencies,
  effect: Iterator<any>,
  permissions: Array<string> = [],
  title: TMessage,
  message: TMessage,
  inputLabel?: TMessage,
): Iterator<any> {
  const jwt: string = yield select(selectJwt);

  // check whether all permissions are present and still valid
  if (jwt && hasValidPermissions(jwt, permissions)) {
    yield effect;

    return;
  }

  // obtain a freshly signed token with missing permissions
  try {
    const obtainJwtEffect = neuCall(escalateJwt, permissions);
    yield call(accessWalletAndRunEffect, obtainJwtEffect, title, message, inputLabel);
    yield effect;
  } catch (error) {
    if (error instanceof MessageSignCancelledError) {
      logger.info("Signing Cancelled");
    } else {
      throw error;
    }
  }
}

/**
 * Refresh jwt before timing out.
 * In case it's not possible will log out user.
 */
export function* handleJwtTimeout({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    const jwt: string | undefined = yield select(selectJwt);

    if (!jwt) throw new JwtNotAvailable();

    const expiryDate = getJwtExpiryDate(jwt);

    const timeLeft = calculateTimeLeft(expiryDate, true, "milliseconds");

    const timeLeftWithThreshold = timeLeft * 0.9;

    const timing: EDelayTiming = yield safeDelay(timeLeftWithThreshold);

    // Check whether token is valid as delay may be moved in time
    // because different factors (hibernation, browser performance optimizations)
    if (timing === EDelayTiming.EXACT) {
      yield neuCall(refreshJWT);
    } else {
      yield put(actions.auth.logout());
    }
  } catch (e) {
    logger.error(new Error("Failed to Auto Handle JWT AutoLogout"));
    throw e;
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
