import { fillForm } from "../utils/forms";
import { goToEtoDashboard } from "../utils/navigation";
import { formField, tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Eto Terms", () => {
  it("should show 6 available products", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });

    goToEtoDashboard();

    cy.get(tid("eto-progress-widget-eto-terms", "button")).click();

    cy.get(formField("productId")).should("have.length", 6);
  });

  it("should show product details on hover", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });

    goToEtoDashboard();

    cy.get(tid("eto-progress-widget-eto-terms", "button")).click();

    cy.get(
      tid("eto-terms.product.0x0000000000000000000000000000000000000004.tooltip.trigger"),
    ).trigger("mouseover");

    cy.get(
      tid("eto-terms.product.0x0000000000000000000000000000000000000004.tooltip.popover"),
    ).should("exist");
  });

  it("should hide and show transferable toggle", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });

    goToEtoDashboard();

    cy.get(tid("eto-progress-widget-eto-terms", "button")).click();

    // should not show transferable toggle
    fillForm(
      {
        productId: {
          value: "0x0000000000000000000000000000000000000000",
          type: "radio",
        },
      },
      { submit: false },
    );

    cy.get(tid("eto-flow-product-changed-successfully")).should("exist");

    cy.get(formField("tokenTradeableOnSuccess")).should("not.exist");

    // should show transferable toggle
    fillForm(
      {
        productId: {
          value: "0x0000000000000000000000000000000000000001",
          type: "radio",
        },
      },
      { submit: false },
    );

    cy.get(tid("eto-flow-product-changed-successfully")).should("exist");

    cy.get(formField("tokenTradeableOnSuccess")).should("exist");
  });
});
