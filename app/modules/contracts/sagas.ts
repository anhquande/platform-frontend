import BigNumber from "bignumber.js";
import { all, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { IPlatformTermsConstants } from "./reducer";

export async function initializeContracts({
  contractsService,
}: TGlobalDependencies): Promise<void> {
  await contractsService.init();
}

export function* populatePlatformTermsConstants({ contractsService }: TGlobalDependencies): any {
  const contract = contractsService.platformTerms;

  const tempTokenRateExpirayTime = new BigNumber(7 * 24 * 60 * 60); //7 DAYS IN SECONDS

  // These are constants from Universe contract no need for pooling
  const terms: IPlatformTermsConstants = yield all({
    IS_ICBM_INVESTOR_WHITELISTED: contract.IS_ICBM_INVESTOR_WHITELISTED,
    MIN_TICKET_EUR_ULPS: contract.MIN_TICKET_EUR_ULPS,
    PLATFORM_NEUMARK_SHARE: contract.PLATFORM_NEUMARK_SHARE,
    TOKEN_PARTICIPATION_FEE_FRACTION: contract.TOKEN_PARTICIPATION_FEE_FRACTION,
    PLATFORM_FEE_FRACTION: contract.PLATFORM_FEE_FRACTION,
    DATE_TO_WHITELIST_MIN_DURATION: tempTokenRateExpirayTime,
    TOKEN_RATE_EXPIRES_AFTER: contract.TOKEN_RATE_EXPIRES_AFTER,
  });

  yield put(actions.contracts.setPlatformTermConstants(terms));
}
