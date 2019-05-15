import { isFunction } from "lodash/fp";

import { acceptWallet } from "../utils";
import { assertEtoDashboard } from "../utils/assertions";
import { fillForm, TFormFixture } from "../utils/forms";
import { goToEtoDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";

export const submitProposal = () => {
  goToEtoDashboard();

  cy.get(tid("eto-dashboard-submit-proposal")).click();
  acceptWallet();

  cy.get(tid("eto-state-pending")).should("exist");
};

export const submitPreview = () => {
  goToEtoDashboard();

  cy.get(tid("eto-dashboard-publish-eto")).click();
  acceptWallet();
};

export const fillAndAssertFull = (section: string, sideEffect: TFormFixture | (() => void)) => {
  cy.get(tid(section, "button")).click();

  if (isFunction(sideEffect)) {
    sideEffect();
  } else {
    fillForm(sideEffect);
  }

  assertEtoDashboard();
  cy.get(`${tid(section)} ${tid("chart-circle.progress")}`).should("contain", "100%");
};

export const fillAndAssert = (section: string, sectionForm: TFormFixture) => {
  cy.get(tid(section, "button")).click();
  fillForm(sectionForm);
  assertEtoDashboard();
};
