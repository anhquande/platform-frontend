import { goBack, push, replace } from "connected-react-router";
import { LocationDescriptorObject, Path } from "history";

import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { recoverRoutes } from "../../components/wallet-selector/wallet-recover/router/recoverRoutes";
import { walletRoutes } from "../../components/wallet/routes";
import { createActionFactory } from "../actionsUtils";

export const routingActions = {
  // navigation primitives
  goBack,
  push: (location: Path | LocationDescriptorObject) => push(location as any),

  // default routes
  goHome: () => push(appRoutes.root),
  goEtoHome: () => push(appRoutes.etoLanding),

  //kyc routes
  goToKYCHome: () => push(kycRoutes.start),
  goToKYCIndividualStart: () => push(kycRoutes.individualStart),
  goToKYCIndividualDocumentVerification: () => push(kycRoutes.individualDocumentVerification),
  goToKYCIndividualUpload: () => push(kycRoutes.individualUpload),

  goToKYCLegalRepresentative: () => push(kycRoutes.legalRepresentative),
  goToKYCBusinessData: () => push(kycRoutes.businessData),
  goToKYCBeneficialOwners: () => push(kycRoutes.beneficialOwners),

  // dashboard
  goToDashboard: () => push(appRoutes.dashboard),
  ReplaceHistoryAndGoToDashboard: () => replace(appRoutes.dashboard),
  goToProfile: () => push(appRoutes.profile),

  // registration
  goToRegister: () => push(appRoutes.register),

  // login
  goToLogin: () => push(appRoutes.login),
  goToEtoLogin: () => push(appRoutes.loginEto),

  // Successful password recovery
  goToSuccessfulRecovery: () => push(recoverRoutes.success),

  // wallet
  goToWallet: () => push(appRoutes.wallet),

  // deposit founds
  goToDepositEuroToken: () => push(walletRoutes.euroToken),
  goToDepositEth: () => push(walletRoutes.eth),

  // external paths
  openInNewWindow: createActionFactory("OPEN_IN_NEW_WINDOW", (path: string) => ({ path })),

  // Portfolio
  goToPortfolio: () => push(appRoutes.portfolio),

  // other...
};
