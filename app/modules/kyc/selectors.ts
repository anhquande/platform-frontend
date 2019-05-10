import { createSelector } from "reselect";

import {
  EKycRequestType,
  ERequestOutsourcedStatus,
  ERequestStatus,
  KycBankQuintessenceBankAccount,
} from "../../lib/api/KycApi.interfaces";
import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import { IKycState } from "./reducer";
import { TBankAccount } from "./types";

export const selectKyc = (state: IAppState) => state.kyc;

export const selectKycRequestStatus = (state: IAppState): ERequestStatus | undefined => {
  const userKycType = selectKycRequestType(state.kyc);
  switch (userKycType) {
    case EKycRequestType.BUSINESS:
      return state.kyc.businessRequestState!.status === "Accepted" && !selectIsClaimsVerified(state)
        ? ERequestStatus.PENDING
        : state.kyc.businessRequestState!.status;
    case EKycRequestType.INDIVIDUAL:
      return state.kyc.individualRequestState!.status === "Accepted" &&
        !selectIsClaimsVerified(state)
        ? ERequestStatus.PENDING
        : state.kyc.individualRequestState!.status;
    default:
      return ERequestStatus.DRAFT;
  }
};

export const selectKycRequestOutsourcedStatus = (
  state: DeepReadonly<IKycState>,
): ERequestOutsourcedStatus | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.outsourcedStatus;
  return undefined;
};

export const selectExternalKycUrl = (state: DeepReadonly<IKycState>): string | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.redirectUrl;
  return undefined;
};

export const selectPendingKycRequestType = (
  state: DeepReadonly<IKycState>,
): EKycRequestType | undefined => {
  if (state.individualRequestState && state.individualRequestState.status === "Pending")
    return EKycRequestType.INDIVIDUAL;
  if (state.businessRequestState && state.businessRequestState.status === "Pending")
    return EKycRequestType.BUSINESS;
  return undefined;
};

export const selectKycRequestType = (
  state: DeepReadonly<IKycState>,
): EKycRequestType | undefined => {
  if (state.individualRequestState && state.individualRequestState.status !== "Draft")
    return EKycRequestType.INDIVIDUAL;
  if (state.businessRequestState && state.businessRequestState.status !== "Draft")
    return EKycRequestType.BUSINESS;
  return undefined;
};

export const selectKycOutSourcedURL = (state: DeepReadonly<IKycState>): string => {
  if (state.individualRequestState && state.individualRequestState.redirectUrl)
    return state.individualRequestState.redirectUrl;
  return "";
};

export const selectCombinedBeneficialOwnerOwnership = (state: DeepReadonly<IKycState>): number => {
  if (state.beneficialOwners.length === 0) return 0;
  return state.beneficialOwners.reduce(
    (all, owner) => all + (owner.ownership ? owner.ownership : 0),
    0,
  );
};

export const selectKycLoading = (state: DeepReadonly<IKycState>): boolean =>
  !!state.individualRequestStateLoading || !!state.businessRequestStateLoading;

export const selectWidgetError = (state: DeepReadonly<IKycState>): string | undefined =>
  state.individualRequestError || state.businessRequestError;

export const selectIndividualClientName = (state: DeepReadonly<IKycState>) => {
  const data = state.individualData;

  return data ? [data.firstName, data.lastName].filter(Boolean).join(" ") : undefined;
};

export const selectClientName = (state: DeepReadonly<IKycState>) =>
  (state.businessData && state.businessData.name) || selectIndividualClientName(state);

export const selectClientJurisdiction = createSelector(
  selectKyc,
  (state: DeepReadonly<IKycState>) =>
    (state.businessData && state.businessData.jurisdiction) ||
    (state.individualData && state.individualData.nationality),
);

export const selectClaims = (state: IAppState) => state.kyc.claims;

export const selectIsClaimsVerified = createSelector(
  selectClaims,
  claims => {
    if (claims) {
      return claims.isVerified;
    }

    return false;
  },
);

export const selectIsAccountFrozen = createSelector(
  selectClaims,
  claims => {
    if (claims) {
      return claims.isAccountFrozen;
    }

    return false;
  },
);

export const selectIsUserVerifiedOnBlockchain = (state: IAppState) =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);

export const selectBankAccount = (state: IAppState): DeepReadonly<TBankAccount> | undefined =>
  state.kyc.bankAccount;

export const selectIsBankAccountLoading = (state: IAppState): boolean =>
  state.kyc.bankAccount === undefined;

export const selectQuintessenceBankAccount = (
  state: IAppState,
): DeepReadonly<KycBankQuintessenceBankAccount> | undefined => state.kyc.quintessenceBankAccount;
