import BigNumber from "bignumber.js";
import { filter, map } from "lodash/fp";
import { all, fork, put, select } from "redux-saga/effects";

import { ECurrency } from "../../components/shared/Money.unsafe";
import { InvestorPortfolioMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EEtoState, TEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IUser } from "../../lib/api/users/interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { promisify } from "../../lib/contracts/typechain-runtime";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { addBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Number.utils";
import { actions, TAction } from "../actions";
import { selectUser } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { ITokenDisbursal } from "./types";
import {
  convertToCalculatedContribution,
  convertToInvestorTicket,
  convertToTokenDisbursal,
} from "./utils";

export function* loadInvestorTickets({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "INVESTOR_TICKET_ETOS_LOAD") return;

  try {
    yield all(
      map(
        (eto: TEtoSpecsData) => put(actions.investorEtoTicket.loadEtoInvestorTicket(eto)),
        filter(eto => eto.state === EEtoState.ON_CHAIN, action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    logger.error("Could not load investor tickets", e);
  }
}

export function* loadInvestorTicket(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_LOAD") return;

  if (action.payload.eto.state !== EEtoState.ON_CHAIN) {
    throw new Error("Should be called only when eto is on chain");
  }

  const etoId = action.payload.eto.etoId;
  const user: IUser = yield select((state: IAppState) => selectUser(state.auth));

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);

  const investorTickerRaw = yield etoContract.investorTicket(user.userId);
  yield put(
    actions.investorEtoTicket.setEtoInvestorTicket(
      etoId,
      convertToInvestorTicket(investorTickerRaw),
    ),
  );

  const contribution = yield neuCall(loadComputedContributionFromContract, action.payload.eto);

  yield put(actions.investorEtoTicket.setInitialCalculatedContribution(etoId, contribution));
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: TEtoData,
  amountEuroUlps?: string,
  isICBM = false,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) return;

  const state: IAppState = yield select();
  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  if (etoContract) {
    const newInvestorContributionEurUlps =
      amountEuroUlps || convertToBigInt((eto.minTicketEur && eto.minTicketEur.toString()) || "0");

    const from = selectEthereumAddressWithChecksum(state);

    // TODO: check whether typechain but still is not fixed
    // sorry no typechain, typechain has a bug with boolean casting
    const contribution = yield promisify(etoContract.rawWeb3Contract.calculateContribution, [
      from,
      isICBM,
      newInvestorContributionEurUlps,
    ]);

    return convertToCalculatedContribution(contribution);
  }
}

export function* loadClaimables({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const user: IUser = yield select((state: IAppState) => selectUser(state.auth));

  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  const tokens: [ECurrency, EthereumAddress][] = [
    [ECurrency.EUR_TOKEN, euroToken.address as EthereumAddress],
    [ECurrency.ETH, etherToken.address as EthereumAddress],
  ];

  try {
    const tokensDisbursalRaw = yield feeDisbursal.claimableMutipleByToken(
      tokens.map(([, address]) => address),
      neumark.address,
      user.userId,
    );

    const tokensDisbursal: ITokenDisbursal[] = tokens.map(([token], i) =>
      // claimableMultipeByToken preserves tokens order so it's safe to get exact response by index
      convertToTokenDisbursal(token, tokensDisbursalRaw[i]),
    );

    yield put(actions.investorEtoTicket.setTokensDisbursal(tokensDisbursal));
  } catch (error) {
    yield put(actions.investorEtoTicket.setTokensDisbursal([]));

    logger.error("Failed to load claimables", error);

    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES),
    );
  }
}

export function* getIncomingPayouts({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  try {
    const { euroTokenIncomingPayout, etherTokenIncomingPayout } = yield all({
      euroTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        euroToken.address,
        neumark.address,
      ),
      etherTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        etherToken.address,
        neumark.address,
      ),
    });

    const euroTokenIncomingPayoutValue = addBigNumbers(
      euroTokenIncomingPayout.map((v: BigNumber[]) => v[1]),
    );
    const etherTokenIncomingPayoutValue = addBigNumbers(
      etherTokenIncomingPayout.map((v: BigNumber[]) => v[1]),
    );

    yield put(
      actions.investorEtoTicket.setIncomingPayouts({
        euroTokenIncomingPayoutValue,
        etherTokenIncomingPayoutValue,
      }),
    );
  } catch (error) {
    logger.error("Failed to load incoming payouts", error);

    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_INCOMING_PAYOUTS),
    );
  }
}

export function* investorTicketsSagas(): any {
  yield fork(neuTakeEvery, "INVESTOR_TICKET_ETOS_LOAD", loadInvestorTickets);
  yield fork(neuTakeEvery, "INVESTOR_TICKET_LOAD", loadInvestorTicket);
  yield fork(neuTakeEvery, actions.investorEtoTicket.loadClaimables, loadClaimables);
  yield fork(neuTakeEvery, actions.investorEtoTicket.getIncomingPayouts, getIncomingPayouts);
}
