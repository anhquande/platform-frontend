import { IAppState } from "../../../store";
import { addBigNumbers, multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { selectEtherPriceEur } from "../../shared/tokenPrice/selectors";
import { ETxSenderType, TAdditionalDataByType } from "../types";
import { ETxSenderState, EValidationState } from "./reducer";

export const selectTxSenderModalOpened = (state: IAppState) =>
  state.txSender.state !== ETxSenderState.UNINITIALIZED;

export const selectTxDetails = (state: IAppState) => state.txSender.txDetails;

export const selectTxType = (state: IAppState) => state.txSender.type;

export const selectTxAdditionalData = <T extends ETxSenderType>(
  state: IAppState,
): TAdditionalDataByType<T> | undefined => state.txSender.additionalData;

export const selectTxTimestamp = (state: IAppState): number | undefined =>
  state.txSender.txTimestamp;

export const selectTxGasCostEthUlps = (state: IAppState): string => {
  const details = selectTxDetails(state);
  const gasPrice = (details && details.gasPrice) || "0";
  const gasLimit = (details && details.gas) || "0";
  return multiplyBigNumbers([gasPrice, gasLimit]);
};

export const selectTxGasCostEurUlps = (state: IAppState): string =>
  multiplyBigNumbers([selectEtherPriceEur(state), selectTxGasCostEthUlps(state)]);

export const selectTxValueEthUlps = (state: IAppState): string => {
  const details = selectTxDetails(state);
  return (details && details.value) || "0";
};

export const selectTxValueEurUlps = (state: IAppState): string =>
  multiplyBigNumbers([selectEtherPriceEur(state), selectTxValueEthUlps(state)]);

export const selectTxTotalEthUlps = (state: IAppState): string =>
  addBigNumbers([selectTxValueEthUlps(state), selectTxGasCostEthUlps(state)]);

export const selectTxTotalEurUlps = (state: IAppState): string =>
  addBigNumbers([selectTxValueEurUlps(state), selectTxGasCostEthUlps(state)]);

export const selectTxValidationState = (state: IAppState): EValidationState | undefined =>
  state.txSender.validationState;
