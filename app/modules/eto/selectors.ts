import { find } from "lodash/fp";

import { EEtoState, TEtoData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { selectBookbuildingStats } from "../bookbuilding-flow/selectors";
import { selectIsEligibleToPreEto } from "../investor-portfolio/selectors";
import { hiddenJurisdictions } from "./constants";
import { IEtoState } from "./reducer";
import {
  EETOStateOnChain,
  EEtoSubState,
  IEtoTokenData,
  TEtoStartOfStates,
  TEtoWithCompanyAndContract,
} from "./types";
import { isOnChain } from "./utils";

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
  const contract = state.eto.contracts[previewCode];

  return contract && contract.timedState;
};

export const selectEtoStartOfStates = (
  state: IAppState,
  previewCode: string,
): TEtoStartOfStates | undefined => {
  const contract = state.eto.contracts[previewCode];

  return contract && contract.startOfStates;
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

export const selectIsEtoAnOffer = (state: IAppState, previewCode: string, etoState: EEtoState) => {
  if (etoState !== EEtoState.ON_CHAIN) {
    return true;
  }
  const onChainState = selectEtoOnChainState(state, previewCode);
  return [
    EETOStateOnChain.Setup,
    EETOStateOnChain.Public,
    EETOStateOnChain.Signing,
    EETOStateOnChain.Whitelist,
  ].some(offerState => offerState === onChainState);
};

export const selectFilteredEtosByRestrictedJurisdictions = (
  state: IAppState,
  etos: TEtoData[],
  jurisdiction: string | undefined,
) =>
  jurisdiction
    ? etos.filter(eto => {
        // @See https://github.com/Neufund/platform-frontend/issues/2789#issuecomment-489084892
        const isEtoAnOffer = selectIsEtoAnOffer(state, eto.previewCode, eto.state);
        return (
          !isEtoAnOffer ||
          !hiddenJurisdictions[jurisdiction].some(
            (hiddenJurisdiction: string) => hiddenJurisdiction === eto.product.jurisdiction,
          )
        );
      })
    : etos;

/**
 * TODO: Add unit tests
 * @param state
 * @param previewCode
 */
export const selectEtoSubState = (
  state: IAppState,
  previewCode: string,
): EEtoSubState | undefined => {
  const eto = selectEtoWithCompanyAndContract(state, previewCode);

  if (eto !== undefined) {
    switch (eto.state) {
      case EEtoState.PREVIEW:
      case EEtoState.PENDING:
        return EEtoSubState.COMING_SOON;

      case EEtoState.LISTED:
      case EEtoState.PROSPECTUS_APPROVED:
        const stats = selectBookbuildingStats(state, eto.etoId);
        const investorCount = stats ? stats.investorsCount : 0;

        const isInvestorsLimitReached = investorCount >= eto.maxPledges;

        if (eto.isBookbuilding) {
          return EEtoSubState.WHITELISTING;
        }

        if (isInvestorsLimitReached) {
          return EEtoSubState.WHITELISTING_LIMIT_REACHED;
        }

        return EEtoSubState.CAMPAIGNING;

      case EEtoState.ON_CHAIN: {
        if (!isOnChain(eto)) {
          throw new Error(`Eto ${eto.etoId} is on chain but without contracts deployed`);
        }

        const isEligibleToPreEto = selectIsEligibleToPreEto(state, eto.etoId);

        switch (eto.contract.timedState) {
          case EETOStateOnChain.Setup:
            const stats = selectBookbuildingStats(state, eto.etoId);
            const investorCount = stats ? stats.investorsCount : 0;

            const isInvestorsLimitReached = investorCount >= eto.maxPledges;

            if (isInvestorsLimitReached) {
              return EEtoSubState.WHITELISTING_LIMIT_REACHED;
            }

            if (eto.isBookbuilding) {
              return EEtoSubState.WHITELISTING;
            }

            if (!eto.startDate) {
              return EEtoSubState.CAMPAIGNING;
            }

            return isEligibleToPreEto
              ? EEtoSubState.COUNTDOWN_TO_PRESALE
              : EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE;

          case EETOStateOnChain.Whitelist:
            if (!isEligibleToPreEto) {
              return EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE;
            }

            return undefined;
        }
      }
    }
  }

  return undefined;
};
