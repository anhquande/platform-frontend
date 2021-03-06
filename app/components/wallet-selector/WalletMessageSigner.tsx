import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { selectWalletType } from "../../modules/web3/selectors";
import { EWalletType } from "../../modules/web3/types";
import { appConnect } from "../../store";
import { Button } from "../shared/buttons";
import { LoadingIndicator } from "../shared/loading-indicator";
import { WarningAlert } from "../shared/WarningAlert";
import { MessageSignPrompt } from "../signing/MessageSignPrompt";
import { getMessageTranslation } from "../translatedMessages/messages";
import { TMessage } from "../translatedMessages/utils";

import * as styles from "./WalletMessageSigner.module.scss";

interface IStateProps {
  errorMsg?: TMessage;
  walletType: EWalletType;
}

interface IDispatchProps {
  cancelSigning: () => void;
}

interface IOwnProps {
  rootPath: string;
}

export const MessageSignerComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  errorMsg,
  cancelSigning,
  walletType,
}) =>
  // short circuit process for light wallet since it will be automatic
  !errorMsg && walletType === EWalletType.LIGHT ? (
    <LoadingIndicator className={styles.spinner} />
  ) : (
    <>
      <MessageSignPrompt />
      {errorMsg ? (
        <Row className="justify-content-center">
          <Col>
            <WarningAlert className="my-4 text-center">
              {getMessageTranslation(errorMsg)}
            </WarningAlert>
          </Col>
        </Row>
      ) : (
        <LoadingIndicator className={styles.spinner} />
      )}
      {errorMsg && (
        <Row>
          <Col className="text-center">
            <Button onClick={cancelSigning}>
              <FormattedMessage id="form.button.go-back" />
            </Button>
          </Col>
        </Row>
      )}
    </>
  );

MessageSignerComponent.displayName = "MessageSignerComponent";

export const WalletMessageSigner = compose(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: state => ({
      errorMsg: state.walletSelector.messageSigningError as TMessage,
      walletType: selectWalletType(state.web3)!,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      cancelSigning: () => {
        dispatch(actions.walletSelector.reset());
        dispatch(actions.routing.push(ownProps.rootPath));
      },
    }),
  }),
)(MessageSignerComponent);
