import { isFunction } from "lodash";

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
import { fillForm, TFormFixture } from "../utils/forms";
import { goToEtoDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const fillAndAssert = (section: string, sideEffect: TFormFixture | (() => void)) => {
  cy.get(tid(section, "button")).click();

  if (isFunction(sideEffect)) {
    sideEffect();
  } else {
    fillForm(sideEffect);
  }

  assertEtoDashboard();
  cy.get(`${tid(section)} ${tid("chart-circle.progress")}`).should("contain", "100%");
};

describe("Eto Forms", () => {
  it("will fill and submit them all", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToEtoDashboard();

      fillAndAssert("eto-progress-widget-about", aboutForm);

      fillAndAssert("eto-progress-widget-legal-info", legalInfoForm);

      fillAndAssert("eto-progress-widget-investment-terms", investmentTermsForm);

      fillAndAssert("eto-progress-widget-eto-terms", () => {
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

      fillAndAssert("eto-progress-widget-product-vision", productVisionForm);

      fillAndAssert("eto-progress-widget-media", mediaForm);

      // hidden for now as requested in #2633
      // fillAndAssert("eto-progress-widget-risk-assessment", riskForm);

      fillAndAssert("eto-progress-widget-equity-token-info", equityTokenInfoForm);

      fillAndAssert("eto-progress-widget-voting-right", votingRights);
    });
  });
});
