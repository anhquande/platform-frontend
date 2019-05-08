import { acceptWallet } from "../utils";
import { goToEtoDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";

export const submitProposal = () => {
  goToEtoDashboard();

  cy.get(tid("eto-dashboard-submit-proposal")).click();
  acceptWallet();

  cy.get(tid("eto-state-pending")).should("exist");
};
