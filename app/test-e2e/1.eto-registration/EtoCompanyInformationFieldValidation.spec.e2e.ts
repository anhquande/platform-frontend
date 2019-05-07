import { pick } from "lodash/fp";

import { etoRegisterRoutes } from "../../components/eto/registration/routes";
import { fillForm, getFieldError } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { aboutFormRequired, aboutFormSubmit } from "./fixtures";

describe("Eto Company Information Field Validation", () => {
  it("should correctly validate required fields", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      cy.visit(etoRegisterRoutes.companyInformation);
      cy.get(tid("eto.form.company-information")).should("exist");

      const requiredFields = Object.keys(aboutFormRequired);

      requiredFields.forEach(key => {
        getFieldError(tid("eto.form.company-information"), key).then(
          error => expect(error).to.be.empty,
        );
      });

      fillForm({
        ...aboutFormSubmit,
      });

      requiredFields.forEach(key => {
        getFieldError(tid("eto.form.company-information"), key).then(error =>
          expect(error).to.equal("This field is required"),
        );
      });
    });
  });

  it("should focus first invalid input field", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      cy.visit(etoRegisterRoutes.companyInformation);
      cy.get(tid("eto.form.company-information")).should("exist");

      fillForm({
        ...aboutFormSubmit,
      });

      cy.focused().should("have.attr", "name", "brandName");
    });
  });

  it("should focus first invalid textarea field", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      cy.visit(etoRegisterRoutes.companyInformation);
      cy.get(tid("eto.form.company-information")).should("exist");

      const requiredInputFields = pick(
        ["brandName", "companyWebsite", "companyOneliner"],
        aboutFormRequired,
      );

      fillForm({
        ...requiredInputFields,
        ...aboutFormSubmit,
      });

      cy.focused().should("have.attr", "name", "companyDescription");
    });
  });
});
