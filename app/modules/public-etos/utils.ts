import BigNumber from "bignumber.js";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { Overwrite } from "../../types";
import {
  EETOStateOnChain,
  IEtoTotalInvestment,
  TEtoStartOfStates,
  TEtoWithCompanyAndContract,
} from "./types";

export const convertToEtoTotalInvestment = (
  [totalEquivEurUlps, totalTokensInt, totalInvestors]: [BigNumber, BigNumber, BigNumber],
  euroTokenBalance: BigNumber,
  etherTokenBalance: BigNumber,
): IEtoTotalInvestment => ({
  totalEquivEurUlps,
  totalTokensInt,
  totalInvestors,
  euroTokenBalance,
  etherTokenBalance,
});

const convertToDate = (startOf: BigNumber): Date | undefined => {
  if (startOf.isZero()) {
    return undefined;
  }

  return new Date(startOf.mul(1000).toNumber());
};

export const convertToStateStartDate = (
  startOfStates: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
): TEtoStartOfStates => {
  const [
    startOfSetup,
    startOfWhitelist,
    startOfPublic,
    startOfSigning,
    startOfClaim,
    startOfPayout,
    startOfRefund,
  ] = startOfStates.map(convertToDate);

  return {
    [EETOStateOnChain.Setup]: startOfSetup,
    [EETOStateOnChain.Whitelist]: startOfWhitelist,
    [EETOStateOnChain.Public]: startOfPublic,
    [EETOStateOnChain.Signing]: startOfSigning,
    [EETOStateOnChain.Claim]: startOfClaim,
    [EETOStateOnChain.Payout]: startOfPayout,
    [EETOStateOnChain.Refund]: startOfRefund,
  };
};

export function isOnChain(
  eto: TEtoWithCompanyAndContract,
): eto is Overwrite<
  TEtoWithCompanyAndContract,
  { contract: Exclude<TEtoWithCompanyAndContract["contract"], undefined> }
> {
  return eto.state === EEtoState.ON_CHAIN && eto.contract !== undefined;
}
