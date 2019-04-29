import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { IEtoContractData, IEtoTokenData } from "./types";

export interface IEtoState {
  etos: { [previewCode: string]: TEtoSpecsData | undefined };
  companies: { [companyId: string]: TCompanyEtoData | undefined };
  contracts: { [previewCode: string]: IEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: IEtoTokenData | undefined };
}

export const etoFlowInitialState: IEtoState = {
  etos: {},
  companies: {},
  contracts: {},
  displayOrder: undefined,
  maxCapExceeded: {},
  etoWidgetError: undefined,
  tokenData: {},
};

export const etoReducer: AppReducer<IEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoState> => {
  switch (action.type) {
    case actions.eto.setEtos.getType():
      return {
        ...state,
        etos: {
          ...state.etos,
          ...action.payload.etos,
        },
        companies: {
          ...state.companies,
          ...action.payload.companies,
        },
      };
    case actions.eto.setEto.getType():
      return {
        ...state,
        etos: {
          ...state.etos,
          [action.payload.eto.previewCode]: action.payload.eto,
        },
        companies: {
          ...state.companies,
          ...(action.payload.company
            ? { [action.payload.company.companyId]: action.payload.company }
            : {}),
        },
      };
    case actions.eto.setEtosDisplayOrder.getType():
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case actions.eto.setEtoDataFromContract.getType():
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.previewCode]: action.payload.data,
        },
      };
    case actions.eto.setEtoWidgetError.getType():
      return {
        ...state,
        etoWidgetError: true,
      };
    case actions.eto.setTokenData.getType():
      return {
        ...state,
        tokenData: {
          ...state.tokenData,
          [action.payload.previewCode]: action.payload.tokenData,
        },
      };
  }

  return state;
};
