import BigNumber from "bignumber.js";

import { ECurrency } from "../../components/shared/Money.unsafe";
import { Q18 } from "../../config/constants";
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
