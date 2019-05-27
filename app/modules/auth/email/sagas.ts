import { put, select } from "redux-saga/effects";

import { AuthMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IVerifyEmailUser } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists } from "../../../lib/api/users/UsersApi";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import {
  selectActivationCodeFromQueryString,
  selectEmailFromQueryString,
} from "../../web3/selectors";
import { selectUserEmail, selectVerifiedUserEmail } from "../selectors";
import { ELogoutType } from "../types";
import { loadUser } from "../user/sagas";

/**
 * Email Verification
 */
export function* verifyUserEmail({ notificationCenter }: TGlobalDependencies): Iterator<any> {
  const userCode = yield select((s: IAppState) => selectActivationCodeFromQueryString(s.router));
  const urlEmail = yield select((s: IAppState) => selectEmailFromQueryString(s.router));
  const userEmail = yield select((s: IAppState) => selectUserEmail(s.auth));

  if (userEmail && userEmail !== urlEmail) {
    // Logout if there is different user session active
    yield put(actions.auth.logout({ logoutType: ELogoutType.ALREADY_LOGGED_IN }));
    yield notificationCenter.error(
      {
        messageType: AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED_SAME_EMAIL,
      },
      { "data-test-id": "modules.auth.sagas.verify-user-email.toast.verification-failed" },
    );
    return;
  }

  const verifiedEmail = yield select((s: IAppState) => selectVerifiedUserEmail(s.auth));

  yield neuCall(verifyUserEmailPromise, userCode, urlEmail, verifiedEmail);
  yield loadUser();
  yield put(actions.routing.goToProfile());
}

export async function verifyUserEmailPromise(
  { apiUserService, notificationCenter }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_VERIFIED));
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_VERIFIED));
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_EXISTS));
    else notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
  }
}

export async function checkEmailPromise(
  { apiUserService }: TGlobalDependencies,
  email: string,
): Promise<boolean> {
  const emailStatus = await apiUserService.emailStatus(email);
  return emailStatus.isAvailable;
}
