import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { ELogoutType } from "./types";

type TLogoutActionOptions = {
  userType?: EUserType;
  logoutType?: ELogoutType;
};

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  setUser: (user: IUser) => createAction("AUTH_SET_USER", { user }),
  logout: (options?: TLogoutActionOptions) => createAction("AUTH_LOGOUT", options || {}),
  verifyEmail: () => createSimpleAction("AUTH_VERIFY_EMAIL"),
};
