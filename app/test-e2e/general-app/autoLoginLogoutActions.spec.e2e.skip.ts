import { assertDashboard, assertUserInLanding, goToDashboard } from "../utils";
import { createAndLoginNewUser, INVESTOR_WALLET_KEY, JWT_KEY } from "../utils/userHelpers";

describe("auto-logout/auto-login", () => {
  it("should logout automatically when a user logs out from another tab", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();

      cy.clearLocalStorage(JWT_KEY);
      cy.wait(1000);
      assertUserInLanding();
    });
  });
  it.skip("should login automatically when a user logs-in from another tab", () => {
    // This test is skipped, due to problems setting up storage
    cy.visit("/").then(() => {
      assertUserInLanding();
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        const jwt = window.localStorage.getItem(JWT_KEY);
        const walletData = window.localStorage.getItem(INVESTOR_WALLET_KEY);
        cy.clearLocalStorage();
        cy.wait(5000);
        cy.window().then(Windows => {
          Windows.localStorage.setItem(INVESTOR_WALLET_KEY, walletData!);
          Windows.localStorage.setItem(JWT_KEY, jwt!);
        });
        assertDashboard();
      });
    });
  });
});
