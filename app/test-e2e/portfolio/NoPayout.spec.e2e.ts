import { INV_EMPTY_HAS_KYC } from "../fixtures";
import { goToPortfolio } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Investor empty payout", () => {
  beforeEach(() =>
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EMPTY_HAS_KYC,
      clearPendingTransactions: true,
    }),
  );

  it("should show message that there are no payouts", () => {
    goToPortfolio();

    cy.get(tid(`asset-portfolio.no-payouts`)).should("exist");
  });
});
