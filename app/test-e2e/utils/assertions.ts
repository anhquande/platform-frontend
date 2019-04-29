import { get } from "lodash";

import { appRoutes } from "../../components/appRoutes";
import { walletRegisterRoutes } from "../../components/wallet-selector/walletRoutes";
import { mockApiUrl } from "../config";
import { tid } from "./selectors";
import { getPendingTransactions } from "./userHelpers";

export const assertEtoDashboard = () => {
  cy.get(tid("eto-dashboard-application")).should("exist");
  cy.url().should("contain", appRoutes.dashboard);
};

export const assertEtoDocuments = () => {
  cy.get(tid("eto-documents")).should("exist");
  cy.url().should("contain", appRoutes.documents);
};

export const assertDashboard = () => {
  cy.get(tid("dashboard-application")).should("exist");
  return cy.url().should("contain", appRoutes.dashboard);
};

export const assertRegister = () => {
  cy.get(tid("register-layout")).should("exist");
  cy.url().should("contain", walletRegisterRoutes.light);
};

export const assertPortfolio = () => {
  cy.get(tid("portfolio-layout")).should("exist");
  cy.url().should("contain", appRoutes.portfolio);
};

export const assertWallet = () => {
  cy.get(tid("wallet-start-container")).should("exist");
  cy.url().should("contain", appRoutes.wallet);
};

export const assertProfile = () => {
  cy.url().should("contain", "/profile");
  cy.get(tid("eto-profile")).should("exist");
};

export const assertWaitForLatestEmailSentWithSalt = (
  userEmail: string,
  timeout: number = 20000,
) => {
  expect(timeout, `Email not received in ${timeout} ms`).to.be.gt(0);
  cy.wait(1000);
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    if (r.status === 200) {
      const response = get(r, "body[0].personalizations[0].to[0]");
      if (response) {
        const loginLink = get(r, "body[0].personalizations[0].substitutions.-loginLink-");
        expect(response.email).to.be.eq(userEmail);
        expect(loginLink).to.contain("salt");
        return;
      }
    }
    assertWaitForLatestEmailSentWithSalt(userEmail, timeout - 1000);
  });
};

export const assertVerifyEmailWidgetIsInUnverifiedEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.unverified-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertVerifyEmailWidgetIsInNoEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.no-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertVerifyEmailWidgetIsInVerfiedEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.verified-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertEmailActivationWidgetVisible = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget")).should(shouldNotExist ? "not.exist" : "exist");
};

export const assertBackupSeedWidgetVisible = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.backup-seed-widget")).should(shouldNotExist ? "not.exist" : "exist");
};

export const assertErrorModal = () => {
  cy.get(tid("components.modals.generic-modal.title")).should("exist");
};

export const assertButtonIsActive = (id: string) => {
  return cy.get(tid(id)).should("be.not.disabled");
};

export const assertWaitForExternalPendingTransactionCount = (
  count: number,
  timeout: number = 60000,
) => {
  expect(timeout, `External pending transaction not received in ${timeout} ms`).to.be.gt(0);

  cy.wait(3000);

  getPendingTransactions().then(response => {
    if (response.filter(t => t.transaction_type === "mempool").length === count) {
      return;
    }

    assertWaitForExternalPendingTransactionCount(count, timeout - 3000);
  });
};

export const assertLockedAccessModal = () => {
  cy.get(tid("access-light-wallet-locked")).should("exist");
};

export const assertUserInLanding = () => {
  cy.url().should("contain", appRoutes.root);
  cy.get(tid("landing-page")).should("exist");
};

export const assertMoneyNotEmpty = (selector: string) => {
  cy.get(tid(selector)).then($element => {
    const value = $element.text();

    expect(value).to.not.equal("-");
  });
};

export const assertEmailChangeFlow = (): void => {
  cy.get(tid("verify-email-widget.change-email.button")).click();

  cy.get(tid("verify-email-widget-form-email-input")).should("exist");
};

export const assertEmailPendingChange = (email: string, newEmail: string): void => {
  cy.get(tid("profile-email-change-success")).should("exist");
  cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
  cy.get(tid("profile.verify-email-widget.unverified-email")).contains(newEmail);
};

export const assertEmailChangeAbort = (email: string): void => {
  cy.get(tid("profile-email-change-aborted")).should("exist");
  cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
  cy.get(tid("profile.verify-email-widget.unverified-email")).should("not.exist");
};
