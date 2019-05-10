import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { assertUserInLanding, etoFixtureAddressByName, tid } from "../utils";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Unauthorized View", () => {
  describe("for ETO with LI jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    it("should not show jurisdiction disclaimer modal ", () => {
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
      assertEtoView("ETOInPublicState retail eto li security - Quintessence (QTT)");

      cy.get(tid("jurisdiction-disclaimer-modal")).should("not.exist");
    });
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

      assertUserInLanding();
    });
  });
});
