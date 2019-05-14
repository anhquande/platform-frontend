import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent } from "recompose";

import { TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
import { ETxSenderState } from "../../../modules/tx/sender/reducer";
import { ActionRequired, EActionRequiredPosition } from "../../shared/ActionRequired";
import { Button, EButtonLayout } from "../../shared/buttons";
import {
  ConfettiEthereum,
  EEthereumIconSize,
  EEthereumIconTheme,
  EthereumIcon,
} from "../../shared/ethereum";
import { ELoadingIndicator, LoadingIndicator } from "../../shared/loading-indicator";
import { TooltipBase } from "../../shared/tooltips";

import * as failedImg from "../../../assets/img/ether_fail.svg";

interface IExternalProps {
  pendingTransaction?: Pick<TxPendingWithMetadata, "transactionStatus">;
  monitorPendingTransaction: () => void;
}

const PendingTransactionStatusLayout: React.FunctionComponent<Required<IExternalProps>> = ({
  pendingTransaction,
  monitorPendingTransaction,
}) => {
  switch (pendingTransaction.transactionStatus) {
    case ETxSenderState.MINING:
      return (
        <>
          <Button
            data-test-id="pending-transactions-status.mining"
            layout={EButtonLayout.SIMPLE}
            onClick={monitorPendingTransaction}
            className="mr-3"
          >
            <EthereumIcon size={EEthereumIconSize.SMALL} />
          </Button>
          <LoadingIndicator type={ELoadingIndicator.SPINNER} />
        </>
      );

    case ETxSenderState.DONE:
      return (
        <Button
          data-test-id="pending-transactions-status.success"
          layout={EButtonLayout.SIMPLE}
          onClick={monitorPendingTransaction}
        >
          <ConfettiEthereum size={EEthereumIconSize.SMALL} />
        </Button>
      );

    case ETxSenderState.ERROR_SIGN:
      return (
        <Button
          data-test-id="pending-transactions-status.error"
          layout={EButtonLayout.SIMPLE}
          onClick={monitorPendingTransaction}
        >
          <ActionRequired active={true} position={EActionRequiredPosition.BOTTOM}>
            <img src={failedImg} width="28px" alt="" />
          </ActionRequired>
        </Button>
      );

    default:
      throw new Error(
        `Unsupported pending transaction status: ${pendingTransaction.transactionStatus}`,
      );
  }
};

const NoPendingTransaction: React.FunctionComponent = () => (
  <>
    <div
      id="no-pending-transactions"
      data-test-id="pending-transactions-status.no-pending-transactions"
    >
      <EthereumIcon
        size={EEthereumIconSize.SMALL}
        theme={EEthereumIconTheme.SILVER}
        spinning={false}
      />
    </div>

    <TooltipBase target="no-pending-transactions" hideArrow={true}>
      <p className="mb-0">
        <FormattedMessage id="pending-transaction-status.no-pending-transactions.tooltip" />
      </p>
    </TooltipBase>
  </>
);

const PendingTransactionStatus = branch<IExternalProps>(
  props => !props.pendingTransaction || !props.pendingTransaction.transactionStatus,
  renderComponent(NoPendingTransaction),
)(PendingTransactionStatusLayout);

export { PendingTransactionStatus };
