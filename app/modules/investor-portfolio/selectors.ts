import BigNumber from "bignumber.js";
import { isArray } from "lodash/fp";
import { createSelector } from "reselect";

import { shouldShowToken } from "../../components/portfolio/utils";
import { ECurrency } from "../../components/shared/formatters/utils";
import { Q18 } from "../../config/constants";
import { getShareAndTokenPrice } from "../../lib/api/eto/EtoUtils";
import { IAppState } from "../../store";
import { compareBigNumbers } from "../../utils/BigNumberUtils";
import { isZero } from "../../utils/Number.utils";
import { selectEtoById, selectEtos, selectTokenData } from "../eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { selectLockedWalletConnected } from "../wallet/selectors";
import { ICalculatedContribution, TETOWithInvestorTicket, TETOWithTokenData } from "./types";
import { getRequiredIncomingAmount, isPastInvestment } from "./utils";

const selectInvestorTicketsState = (state: IAppState) => state.investorTickets;

export const selectInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  const investmentTicket = investorState.investorEtoTickets[etoId];

  if (investmentTicket) {
    // equivEurUlps is set to zero when investor didn't invest
    return !investmentTicket.equivEurUlps.isZero();
  }

  return false;
};

export const selectEtoWithInvestorTickets = (
  state: IAppState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtos(state);
  if (etos) {
    return etos
      .filter(isOnChain)
      .filter(eto => eto.contract.timedState !== EETOStateOnChain.Setup)
      .filter(eto => selectHasInvestorTicket(state, eto.etoId))
      .map(eto => ({
        ...eto,
        investorTicket: selectInvestorTicket(state, eto.etoId)!,
      }));
  }

  return undefined;
};

export const selectMyAssets = (state: IAppState): TEtoWithCompanyAndContract[] | undefined => {
  const etos = selectEtos(state);

  if (etos) {
    return etos.filter(eto => eto.contract && eto.contract.timedState === EETOStateOnChain.Payout);
  }

  return undefined;
};

export const selectMyPendingAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyInvestorTicketByEtoId = (
  state: IAppState,
  etoId: string,
): TETOWithInvestorTicket | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    // Should only return one
    return etos.filter(eto => eto.etoId === etoId)[0];
  }

  return undefined;
};

export const selectCalculatedContribution = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return (
    investorState.calculatedContributions[etoId] ||
    selectInitialCalculatedContribution(etoId, state)
  );
};

export const selectInitialCalculatedContribution = (
  etoId: string,
  state: IAppState,
): ICalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.initialCalculatedContributions[etoId];
};

export const selectInitialMaxCapExceeded = (state: IAppState, etoId: string): boolean => {
  const initialCalculatedContribution = selectInitialCalculatedContribution(etoId, state);

  if (!initialCalculatedContribution) return false;

  return initialCalculatedContribution.maxCapExceeded;
};

export const selectEquityTokenCountByEtoId = (state: IAppState, etoId: string) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectCalculatedEtoTicketSizesUlpsById = (state: IAppState, etoId: string) => {
  const eto = selectEtoById(state, etoId);
  const contrib = selectCalculatedContribution(state, etoId);
  const investorTicket = selectInvestorTicket(state, etoId);

  let min = (contrib && contrib.minTicketEurUlps) || (eto && Q18.mul(eto.minTicketEur || 0));
  let max =
    (contrib && contrib.maxTicketEurUlps) ||
    (eto && eto.maxTicketEur && Q18.mul(eto.maxTicketEur || 0));

  if (min && max) {
    if (eto && investorTicket) {
      const { tokenPrice } = getShareAndTokenPrice(eto);
      min = BigNumber.max(min.sub(investorTicket.equivEurUlps), Q18.mul(tokenPrice.toString()));
      max = BigNumber.max(max.sub(investorTicket.equivEurUlps), 0);
    }

    return {
      minTicketEurUlps: min,
      maxTicketEurUlps: max,
    };
  }

  return undefined;
};

export const selectNeuRewardUlpsByEtoId = (state: IAppState, etoId: string) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.neuRewardUlps.toString();
};

export const selectIsWhitelisted = (state: IAppState, etoId: string) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return !!contrib && contrib.isWhitelisted;
};

export const selectIsEligibleToPreEto = (state: IAppState, etoId: string) => {
  const isLockedWalletConnected = selectLockedWalletConnected(state);
  const isWhitelisted = selectIsWhitelisted(state, etoId);
  return isLockedWalletConnected || isWhitelisted;
};

/**
 * Selects tokens disbursal with `amountToBeClaimed` greater than zero
 */
export const selectTokensDisbursal = createSelector(
  selectInvestorTicketsState,
  investorTickets => {
    if (isArray(investorTickets.tokensDisbursal)) {
      return investorTickets.tokensDisbursal
        .filter(d => !isZero(d.amountToBeClaimed))
        .filter(t => shouldShowToken(t.token, t.amountToBeClaimed));
    }

    return investorTickets.tokensDisbursal;
  },
);

export const selectMyAssetsWithTokenData = (state: IAppState): TETOWithTokenData[] | undefined => {
  const myAsssets = selectMyAssets(state);
  if (myAsssets) {
    return myAsssets.map((asset: TEtoWithCompanyAndContract) => ({
      ...asset,
      tokenData: selectTokenData(state.eto, asset.previewCode)!,
    }));
  }

  return undefined;
};

export const selectIsIncomingPayoutLoading = (state: IAppState): boolean =>
  state.investorTickets.incomingPayouts.loading;

export const selectEtherTokenIncomingPayout = (state: IAppState): string => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;

  if (incomingPayout) {
    const minimumEtherTokenAmount = getRequiredIncomingAmount(ECurrency.ETH);
    const etherToken = incomingPayout.etherTokenIncomingPayoutValue;

    return compareBigNumbers(etherToken, minimumEtherTokenAmount) >= 0 ? etherToken : "0";
  }
  return "0";
};

export const selectEuroTokenIncomingPayout = (state: IAppState): string => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;

  if (incomingPayout) {
    const minimumEuroTokenAmount = getRequiredIncomingAmount(ECurrency.EUR_TOKEN);
    const euroToken = incomingPayout.euroTokenIncomingPayoutValue;

    return compareBigNumbers(euroToken, minimumEuroTokenAmount) >= 0 ? euroToken : "0";
  }
  return "0";
};

export const selectIsIncomingPayoutAvailable = (state: IAppState): boolean => {
  const etherToken = selectEtherTokenIncomingPayout(state);
  const euroToken = selectEuroTokenIncomingPayout(state);

  const minimumEtherTokenAmount = getRequiredIncomingAmount(ECurrency.ETH);
  const minimumEuroTokenAmount = getRequiredIncomingAmount(ECurrency.EUR_TOKEN);

  // Incoming payout is more or equals 1ETH
  const shouldShowEtherToken = compareBigNumbers(etherToken, minimumEtherTokenAmount) >= 0;
  // Incoming payout is more or equals 100nEUR
  const shouldShowEuroToken = compareBigNumbers(euroToken, minimumEuroTokenAmount) >= 0;

  return shouldShowEtherToken || shouldShowEuroToken;
};

export const selectIsIncomingPayoutDone = (state: IAppState): boolean =>
  state.investorTickets.incomingPayouts.payoutDone;

export const selectPastInvestments = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos
      .filter(eto => eto.investorTicket.claimedOrRefunded)
      .filter(eto => isPastInvestment(eto.contract!.timedState))
      .sort((left, right) => {
        const timedStateLeft = left.contract!.timedState;
        const timedStateRight = right.contract!.timedState;

        const investmentDateLeft = new Date(
          left.contract!.startOfStates[timedStateLeft]!,
        ).getTime();
        const investmentDateRight = new Date(
          left.contract!.startOfStates[timedStateRight]!,
        ).getTime();

        // sort by date DESC
        return investmentDateRight - investmentDateLeft;
      });
  }

  return undefined;
};
