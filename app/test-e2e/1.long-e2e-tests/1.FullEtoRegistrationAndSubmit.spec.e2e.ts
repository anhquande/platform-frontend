import { fillAndAssertFull } from "../eto-registration/EtoRegistrationUtils";
import {
  aboutForm,
  equityTokenInfoForm,
  etoKeyIndividualsForm,
  etoTermsForm,
  investmentTermsForm,
  legalInfoForm,
  mediaForm,
  productVisionForm,
  votingRights,
} from "../eto-registration/fixtures";
import { assertEtoDashboard } from "../utils";
import { fillForm } from "../utils/forms";
import { goToEtoDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Eto Forms", () => {
  it("will fill and submit them all", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToEtoDashboard();

      fillAndAssertFull("eto-progress-widget-about", aboutForm);

      fillAndAssertFull("eto-progress-widget-legal-info", legalInfoForm);

      fillAndAssertFull("eto-progress-widget-investment-terms", investmentTermsForm);

      fillAndAssertFull("eto-progress-widget-eto-terms", () => {
        fillForm(
          {
            productId: {
              value: "0x0000000000000000000000000000000000000007",
              type: "radio",
            },
          },
          { submit: false },
        );

        cy.get(tid("eto-flow-product-changed-successfully"));

        fillForm(etoTermsForm);
      });

      cy.get(tid("eto-progress-widget-key-individuals", "button")).awaitedClick();
      // first click on all the add buttons to open the fields
      cy.get(tid("key-individuals-group-button-team")).click();
      cy.get(tid("key-individuals-group-button-advisors")).awaitedClick();
      cy.get(tid("key-individuals-group-button-keyAlliances")).awaitedClick();
      cy.get(tid("key-individuals-group-button-boardMembers")).awaitedClick();
      cy.get(tid("key-individuals-group-button-notableInvestors")).awaitedClick();
      cy.get(tid("key-individuals-group-button-keyCustomers")).awaitedClick();
      cy.get(tid("key-individuals-group-button-partners")).awaitedClick();
      fillForm(etoKeyIndividualsForm);
      assertEtoDashboard();
      cy.get(
        `${tid("eto-progress-widget-key-individuals")} ${tid("chart-circle.progress")}`,
      ).should("contain", "100%");

      fillAndAssertFull("eto-progress-widget-product-vision", productVisionForm);

      fillAndAssertFull("eto-progress-widget-media", mediaForm);

      // hidden for now as requested in #2633
      // fillAndAssertFull("eto-progress-widget-risk-assessment", riskForm);

      fillAndAssertFull("eto-progress-widget-equity-token-info", equityTokenInfoForm);

      fillAndAssertFull("eto-progress-widget-voting-right", votingRights);
    });
  });
});
