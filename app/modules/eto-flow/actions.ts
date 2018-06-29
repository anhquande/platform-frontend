import { TGeneralEtoData } from "../../lib/api/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const etoFlowActions = {
  loadDataStart: () => createSimpleAction("ETO_FLOW_LOAD_DATA_START"),
  loadData: (data: Partial<TGeneralEtoData>) => createAction("ETO_FLOW_LOAD_DATA", { data }),
  saveDataStart: (data: Partial<TGeneralEtoData>) =>
    createAction("ETO_FLOW_SAVE_DATA_START", { data }),
};
