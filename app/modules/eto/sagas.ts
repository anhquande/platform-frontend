import { LOCATION_CHANGE } from "connected-react-router";
import { camelCase } from "lodash";
import { compose, keyBy, map, omit } from "lodash/fp";
import { delay } from "redux-saga";
import { all, fork, put, race, select, take } from "redux-saga/effects";

import { JurisdictionDisclaimerModal } from "../../components/eto/public-view/JurisdictionDisclaimerModal";
import { EtoMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EEtoState,
  TCompanyEtoData,
  TEtoData,
  TEtoSpecsData,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { ECountries } from "../../lib/api/util/countries.enum";
import { EtherToken } from "../../lib/contracts/EtherToken";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { EuroToken } from "../../lib/contracts/EuroToken";
import { IAppState } from "../../store";
import { Dictionary } from "../../types";
import { divideBigNumbers } from "../../utils/BigNumberUtils";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserVerified, selectUserType } from "../auth/selectors";
import { selectMyAssets } from "../investor-portfolio/selectors";
import { selectClientJurisdiction } from "../kyc/selectors";
import { neuCall, neuFork, neuTakeEvery, neuTakeLatest, neuTakeUntil } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { etoInProgressPoolingDelay, etoNormalPoolingDelay } from "./constants";
import { InvalidETOStateError } from "./errors";
import {
  selectEtoById,
  selectEtoOnChainNextStateStartDate,
  selectEtoWithCompanyAndContract,
} from "./selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "./types";
import { convertToEtoTotalInvestment, convertToStateStartDate, isRestricedEto } from "./utils";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.loadEtoPreview>,
): any {
  const previewCode = action.payload.previewCode;

  try {
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const eto = etoResponse.body;
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EEtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.eto.setEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);

    if (action.payload.widgetView) {
      yield put(actions.eto.setEtoWidgetError());

      return;
    }

    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEto(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.loadEto>,
): any {
  try {
    const etoId = action.payload.etoId;

    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEto(etoId);
    const eto = etoResponse.body;

    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EEtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.eto.setEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by id", e);

    if (action.payload.widgetView) {
      yield put(actions.eto.setEtoWidgetError());

      return;
    }

    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));

    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEtoContact(
  { contractsService, logger }: TGlobalDependencies,
  eto: TEtoData,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) {
    logger.error("Invalid eto state", new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN), {
      etoId: eto.etoId,
    });
    return;
  }

  try {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    const etherTokenContract: EtherToken = contractsService.etherToken;
    const euroTokenContract: EuroToken = contractsService.euroToken;

    // fetch eto contracts state with 'all' to improve performance
    const [
      etherTokenBalance,
      euroTokenBalance,
      timedStateRaw,
      totalInvestmentRaw,
      startOfStatesRaw,
      equityTokenAddress,
      etoTermsAddress,
      etoCommitmentAddress,
    ] = yield all([
      etherTokenContract.balanceOf(etoContract.address),
      euroTokenContract.balanceOf(etoContract.address),
      etoContract.timedState,
      etoContract.totalInvestment(),
      etoContract.startOfStates,
      etoContract.equityToken,
      etoContract.etoTerms,
      etoContract.address,
    ]);

    yield put(
      actions.eto.setEtoDataFromContract(eto.previewCode, {
        equityTokenAddress,
        etoTermsAddress,
        etoCommitmentAddress,
        timedState: timedStateRaw.toNumber(),
        totalInvestment: convertToEtoTotalInvestment(
          totalInvestmentRaw,
          euroTokenBalance,
          etherTokenBalance,
        ),
        startOfStates: convertToStateStartDate(startOfStatesRaw),
      }),
    );
  } catch (e) {
    logger.error("ETO contract data could not be loaded", e, { etoId: eto.etoId });

    // rethrow original error so it can be handled by caller saga
    throw e;
  }
}

function* watchEtoSetAction(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.setEto>,
): any {
  const previewCode = action.payload.eto.previewCode;

  yield neuFork(watchEto, previewCode);
}

function* watchEtosSetAction(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.setEtos>,
): any {
  yield all(map(eto => neuFork(watchEto, eto.previewCode), action.payload.etos));
}

const etoNextStateCount: Dictionary<number | undefined> = {};
function* calculateNextStateDelay({ logger }: TGlobalDependencies, previewCode: string): any {
  const nextStartDate: Date | undefined = yield select((state: IAppState) =>
    selectEtoOnChainNextStateStartDate(state, previewCode),
  );

  if (nextStartDate) {
    const timeToNextState = nextStartDate.getTime() - Date.now();

    if (timeToNextState > 0) {
      etoNextStateCount[previewCode] = undefined;
      // add small delay to start date to avoid fetching eto in same state
      return timeToNextState + 2000;
    }

    // if timeToNextState is negative then user and ethereum clock are not in sync
    // in that case pool eto in two time intervals of 2 and 5 seconds
    // if after than state time is still negative log warning message
    const nextStateWatchCount = etoNextStateCount[previewCode];
    if (nextStateWatchCount === undefined) {
      etoNextStateCount[previewCode] = 1;
      return 2000;
    }

    if (nextStateWatchCount === 1) {
      etoNextStateCount[previewCode] = 2;
      return 5000;
    }

    logger.warn(
      "ETO next state pooling failed.",
      new Error("User and ethereum clocks are not in sync"),
      { etoPreviewCode: previewCode },
    );
  }

  return undefined;
}

function* watchEto(_: TGlobalDependencies, previewCode: string): any {
  const eto: TEtoWithCompanyAndContract = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContract(state, previewCode),
  );

  let strategies: Dictionary<Promise<true>> = {
    default: delay(etoNormalPoolingDelay),
  };

  if (eto.state === EEtoState.ON_CHAIN) {
    if ([EETOStateOnChain.Whitelist, EETOStateOnChain.Public].includes(eto.contract!.timedState)) {
      strategies.inProgress = delay(etoInProgressPoolingDelay);
    }

    const nextStateDelay: number = yield neuCall(calculateNextStateDelay, previewCode);
    // Do not schedule update if it's later than normal pooling
    // otherwise it's possible to overflow max timeout limit
    // see https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    if (nextStateDelay && nextStateDelay < etoNormalPoolingDelay) {
      strategies.nextState = delay(nextStateDelay);
    }
  }

  yield race(strategies);

  yield put(actions.eto.loadEtoPreview(previewCode));
}

function* loadEtos({ apiEtoService, logger, notificationCenter }: TGlobalDependencies): any {
  try {
    const etosResponse: IHttpResponse<TEtoData[]> = yield apiEtoService.getEtos();
    const etos = etosResponse.body;

    const companies = compose(
      keyBy((eto: TCompanyEtoData) => eto.companyId),
      map((eto: TEtoData) => eto.company),
    )(etos);

    const etosByPreviewCode = compose(
      keyBy((eto: TEtoSpecsData) => eto.previewCode),
      // remove company prop from eto
      // it's saved separately for consistency with other endpoints
      map(omit("company")),
    )(etos);

    const order = etosResponse.body.map(eto => eto.previewCode);

    yield all(
      order
        .map(id => etosByPreviewCode[id])
        .filter(eto => eto.state === EEtoState.ON_CHAIN)
        .map(eto => neuCall(loadEtoContact, eto)),
    );

    // load investor tickets
    const userType: EUserType | undefined = yield select((state: IAppState) =>
      selectUserType(state),
    );
    if (userType === EUserType.INVESTOR) {
      yield put(actions.investorEtoTicket.loadInvestorTickets(etosByPreviewCode));
    }

    yield put(actions.eto.setEtos({ etos: etosByPreviewCode, companies }));
    yield put(actions.eto.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e);

    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETOS));

    // set empty display order to remove loading indicator
    yield put(actions.eto.setEtosDisplayOrder([]));
  }
}

function* download(document: IEtoDocument): any {
  if (document) {
    yield put(
      actions.immutableStorage.downloadImmutableFile(
        {
          ipfsHash: document.ipfsHash,
          mimeType: document.mimeType,
          asPdf: true,
        },
        immutableDocumentName[document.documentType],
      ),
    );
  }
}

function* downloadDocument(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.downloadEtoDocument>,
): any {
  yield download(action.payload.document);
}

function* downloadTemplateByType(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.downloadEtoTemplateByType>,
): any {
  const state: IAppState = yield select();
  const eto = selectEtoById(state, action.payload.etoId);
  if (eto) {
    yield download(eto.templates[camelCase(action.payload.documentType)]);
  }
}

export function* loadTokensData({ contractsService }: TGlobalDependencies): any {
  const myAssets = yield select(selectMyAssets);
  const walletAddress = yield select(selectEthereumAddressWithChecksum);

  if (!myAssets) {
    return;
  }

  for (const eto of myAssets) {
    const equityTokenAddress = eto.contract.equityTokenAddress;

    const equityToken = yield contractsService.getEquityToken(equityTokenAddress);

    const { balance, tokensPerShare, tokenController } = yield all({
      balance: equityToken.balanceOf(walletAddress),
      tokensPerShare: equityToken.tokensPerShare,
      tokenController: equityToken.tokenController,
    });

    const controllerGovernance = yield contractsService.getControllerGovernance(tokenController);

    const [
      totalCompanyShares,
      companyValuationEurUlps,
      ,
    ] = yield controllerGovernance.shareholderInformation();

    const tokenPrice = divideBigNumbers(
      divideBigNumbers(companyValuationEurUlps, totalCompanyShares),
      tokensPerShare,
    );

    yield put(
      actions.eto.setTokenData(eto.previewCode, {
        balance: balance.toString(),
        tokensPerShare: tokensPerShare.toString(),
        totalCompanyShares: totalCompanyShares.toString(),
        companyValuationEurUlps: companyValuationEurUlps.toString(),
        tokenPrice: tokenPrice.toString(),
      }),
    );
  }
}

function* verifyEtoAccess(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.eto.verifyEtoAccess>,
): Iterable<any> {
  const eto: ReturnType<typeof selectEtoWithCompanyAndContract> = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContract(state, payload.previewCode),
  );

  if (eto === undefined) {
    throw new Error(`Can not find eto by preview code ${payload.previewCode}`);
  }

  const isUserLoggedInAndVerified: ReturnType<typeof selectIsUserVerified> = yield select(
    selectIsUserVerified,
  );

  if (isRestricedEto(eto)) {
    if (isUserLoggedInAndVerified) {
      const jurisdiction: ReturnType<typeof selectClientJurisdiction> = yield select(
        selectClientJurisdiction,
      );

      if (jurisdiction === undefined) {
        throw new Error("User jurisdiction is not defined");
      }

      if (jurisdiction === ECountries.LIECHTENSTEIN) {
        yield put(actions.routing.goToDashboard());
        return;
      }
    } else {
      yield put(
        actions.genericModal.showModal(JurisdictionDisclaimerModal, {
          restrictedJurisdiction: ECountries.LIECHTENSTEIN,
        }),
      );

      const { confirmed, denied } = yield race({
        confirmed: take(actions.eto.confirmJurisdictionDisclaimer),
        denied: take("GENERIC_MODAL_HIDE"),
      });

      if (denied) {
        yield put(actions.routing.goHome());
      }

      if (confirmed) {
        yield put(actions.genericModal.hideGenericModal());
      }
    }
  }
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, actions.eto.loadEtoPreview, loadEtoPreview);
  yield fork(neuTakeEvery, actions.eto.loadEto, loadEto);
  yield fork(neuTakeEvery, actions.eto.loadEtos, loadEtos);
  yield fork(neuTakeEvery, actions.eto.downloadEtoDocument, downloadDocument);
  yield fork(neuTakeEvery, actions.eto.downloadEtoTemplateByType, downloadTemplateByType);
  yield fork(neuTakeEvery, actions.eto.loadTokensData, loadTokensData);

  yield fork(neuTakeLatest, actions.eto.verifyEtoAccess, verifyEtoAccess);

  yield fork(neuTakeUntil, actions.eto.setEto, LOCATION_CHANGE, watchEtoSetAction);
  yield fork(neuTakeUntil, actions.eto.setEtos, LOCATION_CHANGE, watchEtosSetAction);
}
