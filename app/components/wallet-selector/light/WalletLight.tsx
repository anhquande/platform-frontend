import * as React from "react";

import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { LoginLightWallet } from "./Login/LoginLightWallet";
import { RegisterLightWallet } from "./Register/RegisterLightWallet.unsafe";

import * as styles from "./WalletLight.module.scss";

interface IStateProps {
  isLoginRoute: boolean;
}

export const WalletLightComponent: React.FunctionComponent<IStateProps> = ({ isLoginRoute }) => (
  <section className={styles.section}>
    {isLoginRoute ? <LoginLightWallet /> : <RegisterLightWallet />}
  </section>
);

export const WalletLight = appConnect<IStateProps>({
  stateToProps: s => ({
    isLoginRoute: selectIsLoginRoute(s.router),
  }),
})(WalletLightComponent);
