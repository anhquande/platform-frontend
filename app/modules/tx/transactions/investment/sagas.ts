import { BigNumber } from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { actions } from "../../../actions";
import { selectEtoById, selectEtoWithCompanyAndContractById } from "../../../eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../eto/types";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { EInvestmentType } from "../../../investment-flow/reducer";
import {
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectIsICBMInvestment,
} from "../../../investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectNeuRewardUlpsByEtoId,
} from "../../../investor-portfolio/selectors";
import { selectEtherPriceEur } from "../../../shared/tokenPrice/selectors";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { ETxSenderType } from "../../types";
import { calculateGasLimitWithOverhead } from "../../utils";
import { selectMaximumInvestment } from "./selectors";

export const INVESTMENT_GAS_AMOUNT = "600000";

const createInvestmentTxData = (
  state: IAppState,
  txData: string,
  contractAddress: string,
  value = "0",
) => ({
  to: contractAddress,
  from: selectEthereumAddressWithChecksum(state),
  data: txData,
  value: value,
  gasPrice: selectStandardGasPriceWithOverHead(state),
  gas: calculateGasLimitWithOverhead(INVESTMENT_GAS_AMOUNT),
});

const getEtherLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const investAmountUlps = selectMaximumInvestment(state);

  const txData = contractsService.etherLock
    .transferTx(etoId, new BigNumber(investAmountUlps), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.etherLock.address);
};

const getEuroLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const investAmountUlps = selectMaximumInvestment(state);

  const txData = contractsService.euroLock
    .transferTx(etoId, new BigNumber(investAmountUlps), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.euroLock.address);
};

const getEuroTokenTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const investAmountUlps = selectMaximumInvestment(state);

  // Call IERC223 compliant transfer function
  // otherwise ETOCommitment is not aware of any investment
  // TODO: Fix when TypeChain support overloads
  const txData = contractsService.euroToken.rawWeb3Contract.transfer[
    "address,uint256,bytes"
  ].getData(etoId, investAmountUlps, "");

  return createInvestmentTxData(state, txData, contractsService.euroToken.address);
};

function getEtherTokenTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): ITxData {
  const etherTokenBalance = selectEtherTokenBalance(state);
  const investAmount = state.investmentFlow.ethValueUlps || "0";

  const investAmountUlps = selectMaximumInvestment(state);

  if (!etherTokenBalance) {
    throw new Error("No ether Token Balance");
  }

  if (compareBigNumbers(etherTokenBalance, investAmountUlps) >= 0) {
    // transaction can be fully covered by etherTokens

    // Call IERC223 compliant transfer function
    // otherwise ETOCommitment is not aware of any investment
    // TODO: Fix when TypeChain support overloads
    const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, investAmountUlps, "");
    return createInvestmentTxData(state, txInput, contractsService.etherToken.address);
  } else {
    // fill up etherToken with ether from wallet
    const ethVal = new BigNumber(investAmount);
    const value = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.depositAndTransferTx(etoId, ethVal, [""]).getData();

    return createInvestmentTxData(
      state,
      txCall,
      contractsService.etherToken.address,
      value.toString(),
    );
  }
}

export function* generateInvestmentTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const investmentState = state.investmentFlow;
  const eto = selectEtoById(state, investmentState.etoId)!;

  switch (investmentState.investmentType) {
    case EInvestmentType.Eth:
      return yield getEtherTokenTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.NEur:
      return yield getEuroTokenTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMEth:
      return yield getEtherLockTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMnEuro:
      return yield getEuroLockTransaction(state, contractsService, eto.etoId);
  }
}

export function* investmentFlowGenerator(_: TGlobalDependencies): any {
  yield take(actions.txSender.txSenderAcceptDraft);

  const etoId: string = yield select(selectInvestmentEtoId);
  const eto: TEtoWithCompanyAndContract = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContractById(state, etoId),
  );

  const investmentEth: string = yield select(selectInvestmentEthValueUlps);
  const investmentEur: string = yield select(selectInvestmentEurValueUlps);
  const gasCostEth: string = yield select(selectTxGasCostEthUlps);
  const equityTokens: string = yield select((state: IAppState) =>
    selectEquityTokenCountByEtoId(state, etoId),
  );
  const estimatedReward: string = yield select((state: IAppState) =>
    selectNeuRewardUlpsByEtoId(state, etoId),
  );

  const etherPriceEur: string = yield select(selectEtherPriceEur);
  const isIcbm: boolean = yield select(selectIsICBMInvestment);

  const additionalData = {
    eto: {
      etoId,
      companyName: eto.company.name,
      existingCompanyShares: eto.existingCompanyShares,
      equityTokensPerShare: eto.equityTokensPerShare,
      preMoneyValuationEur: eto.preMoneyValuationEur,
    },
    investmentEth,
    investmentEur,
    gasCostEth,
    equityTokens,
    estimatedReward,
    etherPriceEur,
    isIcbm,
  };

  yield put(actions.txSender.txSenderContinueToSummary<ETxSenderType.INVEST>(additionalData));
}
