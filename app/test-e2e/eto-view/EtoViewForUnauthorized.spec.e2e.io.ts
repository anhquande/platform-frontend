import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { assertUserInLanding, etoFixtureAddressByName, tid } from "../utils";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Unauthorized View", () => {
  describe("for ETO with LI jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    it("should not show jurisdiction disclaimer modal ", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView(
        "ETOInPublicState retail eto li security - Quintessence (QTT)",
        EJurisdiction.LIECHTENSTEIN,
      );

      cy.get(tid("jurisdiction-disclaimer-modal")).should("not.exist");
    });
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should show jurisdiction disclaimer modal and allow to stay after confirm", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.confirm")).click();

      assertEtoView("ETOInWhitelistState ff eto - Rich (RCH)", EJurisdiction.GERMANY);
    });

    it("should show jurisdiction disclaimer modal and navigate to dashboard on deny", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.deny")).click();

      assertUserInLanding();
    });
  });
});
