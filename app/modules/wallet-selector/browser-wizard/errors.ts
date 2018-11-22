import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";
import { ethereumNetworkIdToNetworkName } from "../../web3/utils";

/**
 * Returns error message or undefined if error is unknown
 */
export function mapBrowserWalletErrorToErrorMessage(e: Error): string | undefined {
  if (e instanceof BrowserWalletLockedError) {
    return "Your wallet seems to be locked — we can't access any accounts";
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return `Your wallet is connected to the wrong network: ${ethereumNetworkIdToNetworkName(
      e.actualNetworkId,
    )}. Please change the network`;
  }
  if (e instanceof BrowserWalletMissingError) {
    return "We did not detect any Web3 wallet";
  }
  if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    return "Data approval rejected";
  }
  if (e instanceof BrowserWalletAccountApprovalPendingError) {
    return "Data approval pending";
  }

  return undefined;
}
//TODO: ADD TRANSLATIONS
