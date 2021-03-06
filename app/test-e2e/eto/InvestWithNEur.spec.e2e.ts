import {
  assertButtonIsActive,
  confirmAccessModal,
  etoFixtureAddressByName,
  goToDashboard,
  parseAmount,
} from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Invest with nEur", () => {
  // TODO: Add fixture with nEur
  it.skip("invest 1000 nEuro", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // click invest now button
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

      cy.get(tid("investment-type.selector.NEUR")).check({ force: true });

      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("1000");

      // wait for calculation to complete
      assertButtonIsActive("invest-modal-invest-now-button");

      cy.get(tid("invest-modal.est-neu-tokens"))
        .then($element => parseAmount($element.text()))
        .as("estimatedReward");

      cy.get(tid("invest-modal-invest-now-button")).click();

      cy.get(tid("invest-modal-summary-confirm-button")).click();

      confirmAccessModal();

      cy.get(tid("investment-flow.success.title"));

      cy.get(tid("investment-flow.success.view-your-portfolio")).click();
    });
  });
});
