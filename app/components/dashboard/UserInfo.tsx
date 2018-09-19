import * as React from "react";

import { actions } from "../../modules/actions";
import { selectIsAuthorized, selectUserEmail } from "../../modules/auth/selectors";
import {
  selectAmountOfMinedTxs,
  selectAmountOfPendingTxs,
} from "../../modules/tx/monitor/selectors";
import { appConnect } from "../../store";
import { Button } from "../shared/buttons";

interface IStateProps {
  isAuthorized: boolean;
  email?: string;

  pendingTxs: number;
  minedTxs: number;
}

interface IDispatchProps {
  sign: () => void;
  send: () => void;
}

const UserInfoComponent: React.SFC<IStateProps & IDispatchProps> = ({
  isAuthorized,
  email,
  sign,
  send,
  minedTxs,
  pendingTxs,
}) => {
  if (!isAuthorized) {
    return <h3>No user! </h3>;
  } else {
    return (
      <div>
        <h3>User email: {email || "<no email>"}</h3>
        <Button onClick={sign}>SIGN A MESSAGE</Button>
        <Button onClick={send}>SEND TX</Button>

        <p>Pending Txs: {pendingTxs}</p>
        <p>Mined Txs: {minedTxs}</p>
      </div>
    );
  }
};

export const UserInfo = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    email: selectUserEmail(s.auth),
    pendingTxs: selectAmountOfPendingTxs(s.txMonitor),
    minedTxs: selectAmountOfMinedTxs(s.txMonitor),
  }),
  dispatchToProps: dispatch => ({
    sign: () => {
      dispatch(
        actions.txSender.signDebugDummyMessage(
          "5b7b226e616d65223a202261646472657373222c202274797065223a202261646472657373222c202276616c7565223a2022307837396665334332444335646135394135424561643843663731423234303641643232656432423344227d2c207b226e616d65223a202273616c74222c202274797065223a2022737472696e67222c202276616c7565223a202237646266306633636261663934383263396439653931653161303262643934333062376236346536383434326465373434353862333261343431663431653430227d2c207b226e616d65223a202274696d657374616d70222c202274797065223a202275696e743332222c202276616c7565223a20313531393232333232357d2c207b226e616d65223a20227369676e65725f74797065222c202274797065223a2022737472696e67222c202276616c7565223a20226574685f7369676e547970656444617461227d2c207b226e616d65223a20226d6163222c202274797065223a2022737472696e67222c202276616c7565223a2022393663383630656664393864373862646161383665336562643239633266653563386365323966376364346534653363633633663563313233363133663039363436383734383436333762313661646235393537623935383332373262343333227d5d",
        ),
      );
    },
    send: () => {
      dispatch(actions.txSender.sendDebugDummyTx());
    },
  }),
})(UserInfoComponent);
