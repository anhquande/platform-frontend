import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import {
  selectTxAdditionalData,
  selectTxDetails,
  selectTxTimestamp,
} from "../../../../modules/tx/sender/selectors";
import { ETxSenderType, TSpecificTransactionState } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons/Button.unsafe";
import { EthereumIcon } from "../../../shared/ethereum";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { Message } from "../../Message";
import { TxDetails } from "../TxDetails.unsafe";
import { TxName } from "../TxName";
import { TxHashAndBlock } from "./TxHashAndBlock";

import * as ethIcon from "../../../../assets/img/ether.svg";

export interface IStateProps {
  txData?: ITxData;
  txTimestamp?: number;
  additionalData?: TSpecificTransactionState["additionalData"];
}

export interface ITxPendingProps {
  blockId?: number;
  txHash?: string;
  type: TSpecificTransactionState["type"];
}

interface IDispatchProps {
  deletePendingTransaction: () => void;
  goToWallet: () => void;
}

type TTxPendingLayoutProps = {
  txData?: ITxData;
  blockId?: number;
  txHash?: string;
  txTimestamp?: number;
} & TSpecificTransactionState &
  IDispatchProps;

const TxPendingSimpleLayout: React.FunctionComponent<TTxPendingLayoutProps> = props => (
  <>
    <Heading size={EHeadingSize.SMALL} level={4} className="mb-4">
      <FormattedMessage id="modal.sent-eth.pending-title" />
    </Heading>
    <Message image={<img src={ethIcon} alt="" className="my-4 d-block mx-auto" />}>
      <Button onClick={props.goToWallet}>
        <FormattedMessage id="modal.sent-eth.return-to-wallet" />
      </Button>
    </Message>
  </>
);

const TxPendingLayout: React.FunctionComponent<TTxPendingLayoutProps> = props =>
  props.type === ETxSenderType.WITHDRAW ? (
    <TxPendingSimpleLayout {...props} />
  ) : (
    <Message
      data-test-id="modals.shared.tx-pending.modal"
      image={<EthereumIcon className="mb-3" />}
      title={
        <FormattedMessage
          id="tx-sender.tx-pending.title"
          values={{ transaction: <TxName type={props.type} /> }}
        />
      }
      text={<FormattedMessage id="tx-sender.tx-pending.description" />}
    >
      <TxDetails className="mb-3" {...props} />

      {props.txHash && <TxHashAndBlock txHash={props.txHash} blockId={props.blockId} />}

      {/* This feature is only for testing purpose should not be enabled on production environment. */}
      {/* Because of it there is no need to include button string in translations */}
      {process.env.NF_ENABLE_TRANSACTION_RESET === "1" && (
        <Button className="mt-4" onClick={() => props.deletePendingTransaction()}>
          Delete transaction
        </Button>
      )}
    </Message>
  );

const TxPending = compose<TTxPendingLayoutProps, ITxPendingProps>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: d => ({
      deletePendingTransaction: () => d(actions.txTransactions.deletePendingTransaction()),
      goToWallet: () => d(actions.routing.goToWallet()),
    }),
    stateToProps: state => ({
      txData: selectTxDetails(state),
      txTimestamp: selectTxTimestamp(state),
      additionalData: selectTxAdditionalData(state),
    }),
  }),
)(TxPendingLayout);

export { TxPending, TxPendingLayout };
