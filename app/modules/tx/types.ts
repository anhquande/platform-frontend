import { TClaimAdditionalData } from "./transactions/claim/types";
import { TEtoSetDateAdditionalData } from "./transactions/eto-flow/types";
import { TInvestmentAdditionalData } from "./transactions/investment/types";
import { TAcceptPayoutAdditionalData } from "./transactions/payout/accept/types";
import { TRedistributePayoutAdditionalData } from "./transactions/payout/redistribute/types";
import { TNEurRedeemAdditionalDetails } from "./transactions/redeem/types";
import { TUnlockAdditionalData } from "./transactions/unlock/types";
import { TUpgradeAdditionalData } from "./transactions/upgrade/types";
import { TWithdrawAdditionalData } from "./transactions/withdraw/types";

export interface IWithdrawDraftType {
  type: ETxSenderType.WITHDRAW;
  to: string;
  value: string;
}

export interface IInvestmentDraftType {
  type: ETxSenderType.INVEST;
}

export type IDraftType = IWithdrawDraftType | IInvestmentDraftType;

export enum ETxSenderType {
  UNLOCK_FUNDS = "UNLOCK_FUNDS",
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
  ETO_SET_DATE = "ETO_SET_DATE",
  SIGN_INVESTMENT_AGREEMENT = "SIGN_INVESTMENT_AGREEMENT",
  USER_CLAIM = "USER_CLAIM",
  INVESTOR_ACCEPT_PAYOUT = "INVESTOR_ACCEPT_PAYOUT",
  INVESTOR_REDISTRIBUTE_PAYOUT = "INVESTOR_REDISTRIBUTE_PAYOUT",
  NEUR_REDEEM = "NEUR_REDEEM",
}

export interface ITxTypeWithData<T extends ETxSenderType | undefined, P> {
  type: T;
  additionalData: P;
}

type TTxSenderWithdrawState = ITxTypeWithData<ETxSenderType.WITHDRAW, TWithdrawAdditionalData>;

type TTxSenderClaimState = ITxTypeWithData<ETxSenderType.USER_CLAIM, TClaimAdditionalData>;

type TTxSenderEtoSetDateState = ITxTypeWithData<
  ETxSenderType.ETO_SET_DATE,
  TEtoSetDateAdditionalData
>;

type TTxSenderInvestState = ITxTypeWithData<ETxSenderType.INVEST, TInvestmentAdditionalData>;

type TTxSenderAcceptPayoutState = ITxTypeWithData<
  ETxSenderType.INVESTOR_ACCEPT_PAYOUT,
  TAcceptPayoutAdditionalData
>;

type TTxSenderRedistributePayoutState = ITxTypeWithData<
  ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT,
  TRedistributePayoutAdditionalData
>;

type TTxSenderNEurRedeemState = ITxTypeWithData<
  ETxSenderType.NEUR_REDEEM,
  TNEurRedeemAdditionalDetails
>;

type TTxSenderUnlockState = ITxTypeWithData<ETxSenderType.UNLOCK_FUNDS, TUnlockAdditionalData>;

type TTxSenderUpgradeState = ITxTypeWithData<ETxSenderType.UPGRADE, TUpgradeAdditionalData>;

type TTxSenderSignInvestmentAgreementState = ITxTypeWithData<
  ETxSenderType.SIGN_INVESTMENT_AGREEMENT,
  undefined
>;

export type TSpecificTransactionState =
  | TTxSenderSignInvestmentAgreementState
  | TTxSenderUpgradeState
  | TTxSenderUnlockState
  | TTxSenderNEurRedeemState
  | TTxSenderRedistributePayoutState
  | TTxSenderAcceptPayoutState
  | TTxSenderInvestState
  | TTxSenderEtoSetDateState
  | TTxSenderWithdrawState
  | TTxSenderClaimState;

export type TAdditionalDataByType<T extends ETxSenderType> = Extract<
  TSpecificTransactionState,
  { type: T }
>["additionalData"];

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}
