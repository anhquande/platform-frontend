import BigNumber from "bignumber.js";

import {
  assertButtonIsActive,
  confirmAccessModal,
  etoFixtureAddressByName,
  goToDashboard,
  parseAmount,
} from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Invest with ethereum", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // click invest now button
      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("1.3");

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

      cy.get(tid("portfolio-reserved-asset-neu-reward")).then($element => {
        const neuReward = parseAmount($element.text());
        // TODO: this will be super flaky, read NEU balance before test and then add to estimatedReward
        cy.get<BigNumber>("@estimatedReward").then(estimatedReward => {
          // estimated and actual NEU reward can be a little bit different
          // we allow neu reward to differ from estimated 5%
          // TODO: where is the abs() used, it can be negative
          expect(neuReward.minus(estimatedReward)).to.be.bignumber.lessThan(0.05);
        });
      });
    });
  });
});
