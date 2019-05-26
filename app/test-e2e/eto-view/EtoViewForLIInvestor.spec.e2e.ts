import { etoPublicViewByIdLink, etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { SPARE_1 } from "../fixtures";
import { etoFixtureAddressByName } from "../utils";
import { assertDashboard } from "../utils/assertions";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto LI Investor View", () => {
  beforeEach(() =>
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: SPARE_1,
      hdPath: "m/44'/60'/0'/0",
    }),
  );

  describe("for ETO with LI jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    it("should allow to visit ", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView(
        "ETOInPublicState mini eto li - Quintessence (QTT)",
        EJurisdiction.LIECHTENSTEIN,
      );
    });

    it("should not allow link with wrong Jurisdiction ", () => {
      cy.visit(etoPublicViewByIdLink(ETO_ID, EJurisdiction.GERMANY));
      assertDashboard();
    });
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should not allow to visit", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      assertDashboard();
    });
  });
});
