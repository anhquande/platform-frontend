import { goToEtoDashboard, goToEtoPreview } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { fillAndAssert, submitPreview } from "./EtoRegistrationUtils";
import {
  aboutFormRequired,
  aboutFormSubmit,
  equityTokenInfoForm,
  legalInfoRequiredForm,
  mediaRequiredForm,
} from "./fixtures";

describe("Eto Forms submit preview", () => {
  it("should fill required fields and submit preview", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToEtoDashboard();

      fillAndAssert("eto-progress-widget-about", {
        ...aboutFormRequired,
        ...aboutFormSubmit,
      });

      fillAndAssert("eto-progress-widget-legal-info", legalInfoRequiredForm);

      fillAndAssert("eto-progress-widget-media", mediaRequiredForm);

      fillAndAssert("eto-progress-widget-equity-token-info", equityTokenInfoForm);

      submitPreview();

      cy.get(tid("eto-dashboard-publish-eto")).should("be.disabled");

      goToEtoPreview();

      cy.get(tid("eto-state-preview")).contains("Preview");
    });
  });
});
