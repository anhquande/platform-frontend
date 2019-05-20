import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm } from "./fixtures";

const initiateIDNowKyc = () => {
  // go to kyc select and then individual page
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-personal")).awaitedClick();
  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);

  // fill and submit the form
  fillForm(kycInvidualForm);

  cy.get(tid("kyc-go-to-outsourced-verification")).awaitedClick();
};

const checkCancelButton = (click?: boolean) => {
  cy.visit(appRoutes.profile);
  if (click)
    cy.get(tid("settings.kyc-status-widget.cancel-external-kyc-button")).awaitedClick(1500);
  else cy.get(tid("settings.kyc-status-widget.cancel-external-kyc-button"));
};
describe.skip("KYC Personal flow with ID Now", () => {
  it("should go through ID Now Cancel then try ID now again", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      initiateIDNowKyc();
      checkCancelButton(true);
      //Second Time
      initiateIDNowKyc();
      checkCancelButton();
    });
  });
});
