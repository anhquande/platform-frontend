import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { IEtoFlowState } from "./types";

export const etoFlowInitialState: IEtoFlowState = {
  etoPreviewCode: undefined,
  products: undefined,
  loading: false,
  saving: false,
  bookbuildingStats: [],
  signedInvestmentAgreementUrlLoading: false,
  signedInvestmentAgreementUrl: null,
};

export const etoFlowReducer: AppReducer<IEtoFlowState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoFlowState> => {
  switch (action.type) {
    case "ETO_FLOW_LOAD_ISSUER_ETO":
      return {
        ...state,
        loading: true,
      };
    case "ETO_FLOW_SET_ISSUER_ETO_PREVIEW_CODE":
      return {
        ...state,
        etoPreviewCode: action.payload.etoPreviewCode,
        loading: false,
        saving: false,
      };
    case "ETO_FLOW_LOAD_DATA_STOP":
      return {
        ...state,
        loading: false,
        saving: false,
      };
    case "ETO_FLOW_SAVE_DATA_START":
    case "ETO_FLOW_SUBMIT_DATA_START":
      return {
        ...state,
        saving: true,
      };
    case "ETO_FLOW_SET_START_DATE":
    case "ETO_FLOW_CLEAR_START_DATE":
      return {
        ...state,
        ...action.payload,
      };
    case actions.etoFlow.loadSignedInvestmentAgreement.getType():
      return {
        ...state,
        signedInvestmentAgreementUrlLoading: true,
      };
    case actions.etoFlow.setInvestmentAgreementHash.getType():
      return {
        ...state,
        signedInvestmentAgreementUrlLoading: false,
        signedInvestmentAgreementUrl: action.payload.signedInvestmentAgreementUrl,
      };
    case actions.etoFlow.setProducts.getType():
      return {
        ...state,
        products: action.payload.products,
      };
  }
  return state;
};
