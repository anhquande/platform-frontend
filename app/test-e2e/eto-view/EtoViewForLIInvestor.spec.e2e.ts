import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
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
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
      assertEtoView("ETOInPublicState retail eto li security - Quintessence (QTT)");
    });
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should not allow to visit", () => {
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));

      assertDashboard();
    });
  });
});
