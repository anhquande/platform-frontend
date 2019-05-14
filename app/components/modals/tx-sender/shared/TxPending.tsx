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
import { TSpecificTransactionState } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons/Button";
import { EthereumIcon } from "../../../shared/ethereum";
import { Message } from "../../Message";
import { TxDetails } from "../TxDetails.unsafe";
import { TxName } from "../TxName";
import { TxHashAndBlock } from "./TxHashAndBlock";

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
}

type TTxPendingLayoutProps = {
  txData?: ITxData;
  blockId?: number;
  txHash?: string;
  txTimestamp?: number;
} & TSpecificTransactionState &
  IDispatchProps;

const TxPendingLayout: React.FunctionComponent<TTxPendingLayoutProps> = props => (
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
    }),
    stateToProps: state => ({
      txData: selectTxDetails(state),
      txTimestamp: selectTxTimestamp(state),
      additionalData: selectTxAdditionalData(state),
    }),
  }),
)(TxPendingLayout);

export { TxPending, TxPendingLayout };
