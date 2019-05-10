import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { assertDashboard, etoFixtureAddressByName, tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Unapproved Investor View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("should show investment notification when kyc is not done", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
    assertEtoView("ETOInPublicState retail eto li security - Quintessence (QTT)");

    cy.get(tid("eto-overview-settings-update-required-to-invest")).should("exist");
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should show jurisdiction disclaimer modal and allow to stay after confirm", () => {
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.confirm")).click();

      assertEtoView("ETOInWhitelistState ff eto - Rich (RCH)");
    });

    it("should show jurisdiction disclaimer modal and navigate to dashboard on deny", () => {
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.deny")).click();

      assertDashboard();
    });
  });
});
