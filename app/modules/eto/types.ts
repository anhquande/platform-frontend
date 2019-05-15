import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { DeepReadonly } from "../../types";

export interface IEtoTotalInvestment {
  totalEquivEurUlps: string;
  totalTokensInt: string;
  totalInvestors: string;
  euroTokenBalance: string;
  etherTokenBalance: string;
}

// Order is important. Next state is calculated by adding 1 to current state.
export enum EETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export type TEtoStartOfStates = Record<EETOStateOnChain, Date | undefined>;

export interface IEtoContractData {
  timedState: EETOStateOnChain;
  totalInvestment: IEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
}

export type TEtoWithCompanyAndContract = DeepReadonly<
  TEtoSpecsData & {
    // contract is undefined when ETO is not on blockchain
    contract?: IEtoContractData;
    company: TCompanyEtoData;
  }
>;

export interface IEtoTokenData {
  balance: string;
  tokensPerShare: string;
  totalCompanyShares: string;
  companyValuationEurUlps: string;
  tokenPrice: string;
}

export enum EEtoSubState {
  COMING_SOON = "coming_soon",
  COUNTDOWN_TO_PRESALE = "countdown_to_presale",
  COUNTDOWN_TO_PUBLIC_SALE = "countdown_to_public_sale",
}
