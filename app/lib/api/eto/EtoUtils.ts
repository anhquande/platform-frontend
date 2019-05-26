import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { TEtoSpecsData, TPartialEtoSpecData } from "./EtoApi.interfaces.unsafe";

export const getInvestmentAmount = (eto: TPartialEtoSpecData) => {
  const { sharePrice } = getShareAndTokenPrice(eto);

  return {
    minInvestmentAmount: getMaxInvestmentAmountWithDiscount(
      eto,
      sharePrice,
      eto.minimumNewSharesToIssue,
    ),
    maxInvestmentAmount: getMaxInvestmentAmountWithDiscount(eto, sharePrice, eto.newSharesToIssue),
  };
};

export const getNumberOfTokens = ({
  newSharesToIssue = 1,
  minimumNewSharesToIssue = 0,
  equityTokensPerShare = 1,
}: TPartialEtoSpecData) => ({
  computedMaxNumberOfTokens: newSharesToIssue * equityTokensPerShare,
  computedMinNumberOfTokens: minimumNewSharesToIssue * equityTokensPerShare,
});

export const getCapPercent = ({
  newSharesToIssue = 1,
  minimumNewSharesToIssue = 0,
  existingCompanyShares = 1,
}: TPartialEtoSpecData) => ({
  computedMaxCapPercent: (newSharesToIssue / existingCompanyShares) * 100,
  computedMinCapPercent: (minimumNewSharesToIssue / existingCompanyShares) * 100,
});

export const getShareAndTokenPrice = ({
  preMoneyValuationEur = 0,
  existingCompanyShares = 0,
  equityTokensPerShare = 1,
}: TPartialEtoSpecData) => {
  let sharePrice = 0;
  let tokenPrice = 0;
  if (existingCompanyShares !== 0 && equityTokensPerShare !== 0 && preMoneyValuationEur !== 0) {
    sharePrice = preMoneyValuationEur / existingCompanyShares;
    tokenPrice = sharePrice / equityTokensPerShare;
  }
  return {
    sharePrice,
    tokenPrice,
  };
};

const getMaxInvestmentAmountWithDiscount = (
  {
    newSharesToIssueInFixedSlots = 0,
    newSharesToIssueInWhitelist = 0,
    fixedSlotsMaximumDiscountFraction = 0,
    whitelistDiscountFraction = 0,
    publicDiscountFraction = 0,
  }: TPartialEtoSpecData,
  sharePrice = 0,
  shares = 0,
) => {
  if (sharePrice === 0 || shares === 0) {
    return 0;
  }

  let amount = 0;

  if (newSharesToIssueInFixedSlots > 0 && shares > 0) {
    const minShares = Math.min(newSharesToIssueInFixedSlots, shares);

    amount += minShares * sharePrice * (1 - fixedSlotsMaximumDiscountFraction);
    shares -= minShares;
  }

  if (newSharesToIssueInWhitelist > 0 && shares > 0) {
    const minShares = Math.min(newSharesToIssueInWhitelist, shares);

    amount += minShares * sharePrice * (1 - whitelistDiscountFraction);
    shares -= minShares;
  }

  if (shares > 0) {
    amount += shares * sharePrice * (1 - publicDiscountFraction);
  }

  return amount;
};

export const getInvestmentCalculatedPercentage = (eto: TEtoSpecsData) =>
  (eto.newSharesToIssue / eto.minimumNewSharesToIssue) * 100;

export const getCurrentInvestmentProgressPercentage = (eto: TEtoWithCompanyAndContract) => {
  const totalTokensInt = eto.contract!.totalInvestment.totalTokensInt;

  return (
    (parseInt(totalTokensInt, 10) / (eto.minimumNewSharesToIssue * eto.equityTokensPerShare)) * 100
  );
};
