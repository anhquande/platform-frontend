import { IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces";
import { createAction } from "../actionsUtils";

export const LOAD_BOOKBUILDING_FLOW_STATS = "LOAD_BOOKBUILDING_FLOW_STATS";
export const SET_BOOKBUILDING_FLOW_STATS = "SET_BOOKBUILDING_FLOW_STATS";

export const SAVE_PLEDGE = "SAVE_PLEDGE";
export const SET_PLEDGE = "SET_PLEDGE";
export const DELETE_PLEDGE = "DELETE_PLEDGE";
export const LOAD_PLEDGE = "LOAD_PLEDGE";

export const bookBuildingFlowActions = {
  loadBookBuildingStats: (etoId: string) => createAction(LOAD_BOOKBUILDING_FLOW_STATS, { etoId }),
  setBookBuildingStats: (etoId: string, stats: any) =>
    createAction(SET_BOOKBUILDING_FLOW_STATS, { stats, etoId }),
  loadPledge: (etoId: string) => createAction(LOAD_PLEDGE, { etoId }),
  savePledge: (etoId: string, pledge: IPledge) => createAction(SAVE_PLEDGE, { etoId, pledge }),
  deletePledge: (etoId: string) => createAction(DELETE_PLEDGE, { etoId }),
  setPledge: (etoId: string, pledge?: IPledge) => createAction(SET_PLEDGE, { etoId, pledge }),
};
