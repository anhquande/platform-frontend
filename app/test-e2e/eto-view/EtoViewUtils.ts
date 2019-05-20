import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { tid } from "../utils/selectors";

export const assertEtoView = (title?: string, jurisdiction?: EJurisdiction) => {
  cy.get(tid("eto.public-view")).should("exist");
  cy.title().should("eq", title + " - Neufund Platform");
  if (jurisdiction) {
    cy.get(tid(`eto.public-view.jurisdiction-banner.${jurisdiction}`)).should("exist");
    cy.url().should("contain", jurisdiction);
  } else {
    cy.get(tid(`eto.public-view.investor-preview-banner`)).should("exist");
  }
};

export const goToEtoViewById = (etoId: string, title?: string) => {
  cy.visit(withParams(appRoutes.etoPublicViewById, { etoId }));

  assertEtoView(title)
};
