import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { registerWithLightWallet } from "../utils";
import { DEFAULT_PASSWORD, generateRandomEmailAddress } from "../utils/userHelpers";

describe.skip("Lock some routes if registration is not complete", () => {
  // TODO: Enable after https://github.com/Neufund/platform-frontend/pull/2844
  it("should redirect from locked routes to Profile if user's email is not verified yet", () => {
    registerWithLightWallet(generateRandomEmailAddress(), DEFAULT_PASSWORD, false, true);

    cy.visit(kycRoutes.start);
    cy.url().should("contain", appRoutes.profile);

    cy.visit(appRoutes.documents);
    cy.url().should("contain", appRoutes.profile);
  });
});
