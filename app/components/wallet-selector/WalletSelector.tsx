import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { externalRoutes } from "../../config/externalRoutes";
import { actions } from "../../modules/actions";
import {
  selectIsLoginRoute,
  selectOppositeRootPath,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction.unsafe";
import { withContainer } from "../../utils/withContainer.unsafe";
import { appRoutes } from "../appRoutes";
import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";
import { Button, ButtonLink, EButtonLayout } from "../shared/buttons";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutUnauthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";
import { ExternalLink } from "../shared/links";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletRouter } from "./WalletRouter";

import * as styles from "./WalletSelector.module.scss";

interface IStateProps {
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
}

interface IDispatchProps {
  openICBMModal: () => void;
}

export const WalletSelectorComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  isMessageSigning,
  rootPath,
  isLoginRoute,
  oppositeRoute,
  userType,
  openICBMModal,
}) => {
  return (
    <LayoutRegisterLogin>
      {isMessageSigning ? (
        <WalletMessageSigner rootPath={rootPath} />
      ) : (
        <>
          <Row>
            <Col tag="section" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
              <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
                {isLoginRoute ? (
                  <FormattedMessage id="wallet-selector.tabs.login.title" />
                ) : (
                  <FormattedMessage id="wallet-selector.tabs.register.title" />
                )}
              </h1>
              <div className={styles.walletChooserButtons}>
                {(userType === "investor" ||
                  process.env.NF_ISSUERS_CAN_LOGIN_WITH_ANY_WALLET === "1") && (
                  <div className="m-2">
                    <ButtonLink data-test-id="wallet-selector-light" to={`${rootPath}/light`}>
                      {isLoginRoute ? (
                        <FormattedMessage id="wallet-selector.tabs.neuwallet-login" />
                      ) : (
                        <FormattedMessage id="wallet-selector.tabs.neuwallet-register" />
                      )}
                    </ButtonLink>
                  </div>
                )}
                {(userType === "investor" ||
                  process.env.NF_ISSUERS_CAN_LOGIN_WITH_ANY_WALLET === "1") && (
                  <div className="m-2">
                    <ButtonLink data-test-id="wallet-selector-browser" to={`${rootPath}/browser`}>
                      {isLoginRoute ? (
                        <FormattedMessage id="wallet-selector.tabs.browser-wallet-login" />
                      ) : (
                        <FormattedMessage id="wallet-selector.tabs.browser-wallet-register" />
                      )}
                    </ButtonLink>
                  </div>
                )}
                <div className="m-2">
                  <ButtonLink data-test-id="wallet-selector-ledger" to={`${rootPath}/ledger`}>
                    {isLoginRoute ? (
                      <FormattedMessage id="wallet-selector.tabs.ledger-login" />
                    ) : (
                      <FormattedMessage id="wallet-selector.tabs.ledger-register" />
                    )}
                  </ButtonLink>
                </div>
              </div>

              <p className="text-center my-4">
                <FormattedMessage
                  id="wallet-selector.tabs.icbm-help-text"
                  values={{
                    here: (
                      <Button onClick={openICBMModal} layout={EButtonLayout.INLINE}>
                        <strong>
                          <FormattedMessage id="wallet-selector.tabs.icbm-help-text.here" />
                        </strong>
                      </Button>
                    ),
                  }}
                />
              </p>
            </Col>
          </Row>

          <WalletRouter rootPath={rootPath} />

          <Row className="mt-5">
            <Col sm={12} md={6} className="text-center text-md-left">
              {isLoginRoute ? (
                <>
                  <FormattedMessage id="wallet-selector.login.help-link" />{" "}
                  <Link to={appRoutes.restore}>
                    <strong>
                      <FormattedMessage id="wallet-selector.help-link.login.label" />
                    </strong>
                  </Link>
                </>
              ) : (
                <>
                  <FormattedMessage id="wallet-selector.register.help-link" />{" "}
                  <ExternalLink href={`${externalRoutes.neufundSupport}/home`}>
                    <strong>
                      <FormattedMessage id="wallet-selector.help-link.register.label" />
                    </strong>
                  </ExternalLink>
                </>
              )}
            </Col>
            <Col sm={12} md={6} className="text-center text-md-right mt-3 mt-md-0">
              {isLoginRoute ? (
                <FormattedMessage id="wallet-selector.neuwallet.register-link-text" />
              ) : (
                <FormattedMessage id="wallet-selector.neuwallet.login-link-text" />
              )}{" "}
              <Link to={oppositeRoute} data-test-id="wallet-selector-opposite-route-link">
                <strong>
                  {isLoginRoute ? (
                    <FormattedMessage id="wallet-selector.register" />
                  ) : (
                    <FormattedMessage id="wallet-selector.login" />
                  )}
                </strong>
              </Link>
            </Col>
          </Row>
        </>
      )}
    </LayoutRegisterLogin>
  );
};

export const WalletSelector = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.walletSelector.reset()),
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isMessageSigning: s.walletSelector.isMessageSigning,
      rootPath: selectRootPath(s.router),
      isLoginRoute: selectIsLoginRoute(s.router),
      userType: selectUrlUserType(s.router),
      oppositeRoute: selectOppositeRootPath(s.router),
    }),
    dispatchToProps: dispatch => ({
      openICBMModal: () => dispatch(actions.genericModal.showModal(ICBMWalletHelpTextModal)),
    }),
  }),
  withContainer(LayoutUnauthorized),
)(WalletSelectorComponent);
