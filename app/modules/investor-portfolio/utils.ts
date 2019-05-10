import BigNumber from "bignumber.js";
import { includes } from "lodash/fp";

import { IWindowWithData } from "../../../test/helperTypes";
import { ECurrency } from "../../components/shared/formatters/utils";
import { IS_CYPRESS, Q18 } from "../../config/constants";
import { convertToBigInt } from "../../utils/Number.utils";
import { EETOStateOnChain } from "../eto/types";
import { ICalculatedContribution, IInvestorTicket, ITokenDisbursal } from "./types";

export const convertToCalculatedContribution = ([
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
]: [
  boolean,
  boolean,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean
]): ICalculatedContribution => ({
  isWhitelisted,
  isEligible,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
});

export const convertToInvestorTicket = ([
  equivEurUlps,
  rewardNmkUlps,
  equityTokenInt,
  sharesInt,
  tokenPrice,
  neuRate,
  amountEth,
  amountEurUlps,
  claimedOrRefunded,
  usedLockedAccount,
]: [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  boolean
]): IInvestorTicket => ({
  equivEurUlps,
  rewardNmkUlps,
  equityTokenInt,
  sharesInt,
  tokenPrice,
  neuRate,
  amountEth,
  amountEurUlps,
  claimedOrRefunded,
  usedLockedAccount,
});

export const convertToTokenDisbursal = (
  token: ECurrency,
  [amountToBeClaimed, totalDisbursedAmount, timeToFirstDisbursalRecycle]: [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ],
): ITokenDisbursal => ({
  token,
  amountToBeClaimed: amountToBeClaimed.toString(),
  totalDisbursedAmount: totalDisbursedAmount.toString(),
  // convert seconds timestamp to milliseconds
  timeToFirstDisbursalRecycle: timeToFirstDisbursalRecycle.mul(1000).toNumber(),
});

export const getTokenPrice = (equityTokenInt: BigNumber, equivEurUlps: BigNumber): string => {
  if (equivEurUlps.isZero()) {
    return "0";
  }

  const equityToken = Q18.mul(equityTokenInt);
  return equivEurUlps.div(equityToken).toString();
};

export const getRequiredIncomingAmount = (token: ECurrency) => {
  // In case of Cypress tests we have to return 0 by default to prevent tests with low amounts from crash
  // If there is data stored in window use it
  if (IS_CYPRESS) {
    const { payoutRequiredAmount } = window as IWindowWithData;
    return payoutRequiredAmount || "0";
  }

  switch (token) {
    case ECurrency.ETH: {
      return convertToBigInt(1);
    }
    case ECurrency.EUR_TOKEN: {
      return convertToBigInt(100);
    }
    default:
      return "0";
  }
};

export const isPastInvestment = (etoState: EETOStateOnChain) =>
  includes(etoState, [EETOStateOnChain.Payout, EETOStateOnChain.Refund, EETOStateOnChain.Claim]);
