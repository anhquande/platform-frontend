import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import { EUserType, TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import { selectIsAuthorized, selectUserType } from "../../../modules/auth/selectors";
import { selectPlatformPendingTransaction } from "../../../modules/tx/monitor/selectors";
import { appConnect } from "../../../store";
import { appRoutes } from "../../appRoutes";
import { Button, ButtonLink, EButtonLayout, EButtonTheme } from "../../shared/buttons";
import { loginWalletRoutes, walletRegisterRoutes } from "../../wallet-selector/walletRoutes";
import { PendingTransactionStatus } from "./PendingTransactionStatus";

import * as logo from "../../../assets/img/logo_yellow.svg";
import * as logoText from "../../../assets/img/neufund-logo.svg";
import * as styles from "./Header.module.scss";

interface IExternalProps {
  hideCtaButtons?: boolean;
}

interface IStateProps {
  isAuthorized: boolean;
  location?: string;
  userType?: EUserType;
  pendingTransaction?: TxPendingWithMetadata;
}

interface IDispatchProps {
  logout: (userType?: EUserType) => void;
  monitorPendingTransaction: () => void;
}

export const HeaderComponent: React.FunctionComponent<
  IExternalProps & IStateProps & IDispatchProps
> = props => (
  <Navbar dark className={cn(styles.bar)}>
    <Link to={appRoutes.root} className={styles.logo}>
      <img src={logo} className={styles.logoImage} alt="" />
      <img src={logoText} alt="NEUFUND" className={styles.logoText} />
    </Link>

    {!props.hideCtaButtons &&
      (props.isAuthorized ? (
        <section className={cn(styles.right)}>
          <PendingTransactionStatus
            monitorPendingTransaction={props.monitorPendingTransaction}
            pendingTransaction={props.pendingTransaction}
          />
          <Button
            className="ml-2"
            layout={EButtonLayout.SECONDARY}
            theme={EButtonTheme.WHITE}
            onClick={() => props.logout(props.userType)}
            data-test-id="Header-logout"
          >
            <FormattedMessage id="header.logout-button" />
          </Button>
        </section>
      ) : (
        <div className={styles.buttons}>
          {props.location && props.location.indexOf("eto") !== -1 ? (
            <>
              <ButtonLink
                theme={EButtonTheme.WHITE}
                innerClassName={cn(styles.registerButton, styles.resizableButton)}
                data-test-id="Header-register-eto"
                isActive={false}
                to={appRoutes.registerEto}
              >
                <FormattedMessage id="header.register-button" />
              </ButtonLink>
              <ButtonLink
                theme={EButtonTheme.WHITE}
                innerClassName={styles.resizableButton}
                data-test-id="Header-login-eto"
                isActive={false}
                to={appRoutes.loginEto}
              >
                <FormattedMessage id="header.login-button" />
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink
                theme={EButtonTheme.WHITE}
                innerClassName={cn(styles.registerButton, styles.resizableButton)}
                data-test-id="Header-register"
                isActive={false}
                to={walletRegisterRoutes.light}
              >
                <FormattedMessage id="header.register-button" />
              </ButtonLink>
              <ButtonLink
                theme={EButtonTheme.WHITE}
                innerClassName={styles.resizableButton}
                data-test-id="Header-login"
                isActive={false}
                to={loginWalletRoutes.light}
              >
                <FormattedMessage id="header.login-button" />
              </ButtonLink>
            </>
          )}
        </div>
      ))}
  </Navbar>
);

export const Header = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    location: s.router.location && s.router.location.pathname,
    userType: selectUserType(s),
    pendingTransaction: selectPlatformPendingTransaction(s),
  }),
  dispatchToProps: dispatch => ({
    logout: (userType?: EUserType) => {
      dispatch(actions.auth.logout(userType));
    },
    monitorPendingTransaction: () => {
      dispatch(actions.txMonitor.monitorPendingPlatformTx());
    },
  }),
})(HeaderComponent);
