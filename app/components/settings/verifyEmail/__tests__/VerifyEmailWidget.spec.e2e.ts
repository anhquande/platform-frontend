import { tid } from "../../../../../test/testUtils";
import {
  assertUserInDashboard,
  assertVerifyEmailWidgetIsInNoEmailState,
  assertVerifyEmailWidgetIsInUnverifiedEmailState,
  assertVerifyEmailWidgetIsInVerfiedEmailState,
  clearEmailServer,
  confirmAccessModal,
  convertToUniqueEmail,
  goToSettings,
  registerWithLightWallet,
} from "../../../../e2e-test-utils/index";
import {
  assertLatestEmailSentWithSalt,
  verifyLatestUserEmail,
} from "./../../../../e2e-test-utils/index";

describe("Verify Email Widget", () => {
  it("should change user email after register", () => {
    const firstEmail = "moe-wallet-backup-e2e@test.com";
    const secondEmail = convertToUniqueEmail(firstEmail);
    const password = "strongpassword";

    registerWithLightWallet(firstEmail, password);
    clearEmailServer();
    assertUserInDashboard();

    goToSettings();
    assertVerifyEmailWidgetIsInUnverifiedEmailState();
    cy.get(tid("verify-email-widget.change-email.button")).click();
    assertVerifyEmailWidgetIsInNoEmailState();

    cy.get(tid("verify-email-widget-form-email-input")).type(secondEmail);
    cy.get(tid("verify-email-widget-form-submit")).click();

    confirmAccessModal(password);

    // Email server takes time before getting the request
    cy.wait(3000);
    assertLatestEmailSentWithSalt(secondEmail);
    verifyLatestUserEmail();

    assertVerifyEmailWidgetIsInVerfiedEmailState();
    assertVerifyEmailWidgetIsInUnverifiedEmailState(true);
    assertVerifyEmailWidgetIsInNoEmailState(true);
  });
});