import { IWindowWithData } from "../../../test/helperTypes";
import {
  assertDashboard,
  assertEtoDashboard,
  assertPortfolio,
  assertProfile,
  assertWallet,
} from "./assertions";

export const goToDashboard = (assert = true) => {
  cy.visit("/dashboard");

  if (assert) {
    assertDashboard();
  }
};

export const goToDashboardWithRequiredPayoutAmountSet = (
  assert = true,
  requiredPayoutAmount?: string,
) => {
  cy.visit("/dashboard", {
    onBeforeLoad(win: IWindowWithData): void {
      win.payoutRequiredAmount = requiredPayoutAmount;
    },
  });

  if (assert) {
    assertDashboard();
  }
};

export const goToEtoDashboard = () => {
  cy.visit("/dashboard");
  assertEtoDashboard();
};

export const goToEtoPreview = () => {
  cy.visit("/eto/view");
};

export const goToProfile = () => {
  cy.visit("/profile");
  assertProfile();
};

export const goToPortfolio = () => {
  cy.visit("/portfolio");
  assertPortfolio();
};

export const goToWallet = () => {
  cy.visit("/wallet");
  assertWallet();
};

export const goToPortfolioWithRequiredPayoutAmountSet = (requiredPayoutAmount?: string) => {
  cy.visit("/portfolio", {
    onBeforeLoad(win: IWindowWithData): void {
      win.payoutRequiredAmount = requiredPayoutAmount;
    },
  });
  assertPortfolio();
};
