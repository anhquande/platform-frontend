import { INV_EMPTY_HAS_KYC } from "../fixtures";
import { etoFixtureAddressByName } from "../utils";
import { goToDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Try and invest without money", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EMPTY_HAS_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // click invest now button
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("10");

      cy.wait(1000);

      cy.get(tid("invest-modal-invest-now-button")).should("be.disabled");
    });
  });
});
