import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { createAction, createActionFactory } from "../../actionsUtils";

export const txMonitorActions = {
  monitorPendingPlatformTx: createActionFactory("TX_MONITOR_PENDING_PLATFORM_TX"),
  setPendingTxs: (txs: Partial<TPendingTxs>) => createAction("TX_MONITOR_LOAD_TXS", { txs }),
};
