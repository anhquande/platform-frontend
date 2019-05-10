import { find } from "lodash/fp";

import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { IEtoState } from "./reducer";
import { EETOStateOnChain, IEtoTokenData, TEtoWithCompanyAndContract } from "./types";

const selectEtoState = (state: IAppState) => state.eto;

const selectEtoPreviewCode = (state: IAppState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.eto.etos);

  if (eto) {
    return eto.previewCode;
  }

  return undefined;
};

export const selectEtoTokenName = (state: IAppState, etoId: string) => {
  const eto = find(eto => eto!.etoId === etoId, state.eto.etos);

  if (eto) {
    return eto.equityTokenName;
  }

  return undefined;
};

export const selectEto = (state: IAppState, previewCode: string) => state.eto.etos[previewCode];

export const selectEtoById = (state: IAppState, etoId: string) =>
  state.eto.etos[selectEtoPreviewCode(state, etoId)!];

export const selectEtoWithCompanyAndContract = (
  state: IAppState,
  previewCode: string,
): TEtoWithCompanyAndContract | undefined => {
  const etoState = selectEtoState(state);
  const eto = etoState.etos[previewCode];

  if (eto) {
    return {
      ...eto,
      company: etoState.companies[eto.companyId]!,
      contract: etoState.contracts[previewCode],
    };
  }

  return undefined;
};

export const selectEtoWithCompanyAndContractById = (
  state: IAppState,
  etoId: string,
): TEtoWithCompanyAndContract | undefined => {
  const previewCode = selectEtoPreviewCode(state, etoId);

  if (previewCode) {
    return selectEtoWithCompanyAndContract(state, previewCode);
  }

  return undefined;
};

export const selectEtos = (state: IAppState): TEtoWithCompanyAndContract[] | undefined => {
  const etoState = selectEtoState(state);

  if (etoState.displayOrder) {
    return etoState.displayOrder
      .map(id => selectEtoWithCompanyAndContract(state, id)!)
      .filter(Boolean);
  }

  return undefined;
};

export const selectEtoOnChainState = (
  state: IAppState,
  previewCode: string,
): EETOStateOnChain | undefined => {
  const contracts = state.eto.contracts[previewCode];
  return contracts && contracts.timedState;
};

export const selectEtoOnChainNextStateStartDate = (
  state: IAppState,
  previewCode: string,
): Date | undefined => {
  const eto = selectEtoWithCompanyAndContract(state, previewCode);

  if (eto) {
    const nextState: EETOStateOnChain | undefined = eto.contract!.timedState + 1;

    if (nextState) {
      return eto.contract!.startOfStates[nextState];
    }
  }

  return undefined;
};

export const selectEtoWidgetError = (state: DeepReadonly<IEtoState>): boolean | undefined =>
  state.etoWidgetError;

export const selectEtoOnChainStateById = (
  state: IAppState,
  etoId: string,
): EETOStateOnChain | undefined => {
  const code = selectEtoPreviewCode(state, etoId);

  return code ? selectEtoOnChainState(state, code) : undefined;
};

export const selectTokenData = (
  state: DeepReadonly<IEtoState>,
  previewCode: string,
): IEtoTokenData | undefined => state.tokenData[previewCode];
