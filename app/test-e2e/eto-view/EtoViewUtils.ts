import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { tid } from "../utils/selectors";

export const assertEtoView = (title?: string, jurisdiction?: EJurisdiction) => {
  cy.get(tid("eto.public-view")).should("exist");

  if (title) {
    cy.title().should("eq", title + " - Neufund Platform");
  }

  if (jurisdiction) {
    cy.get(tid(`eto.public-view.jurisdiction-banner.${jurisdiction}`)).should("exist");

    cy.url().should("contain", jurisdiction);
  }
};

export const assertEtoIssuerView = (title?: string) => {
  cy.get(tid("eto.public-view")).should("exist");

  if (title) {
    cy.title().should("eq", title + " - Neufund Platform");
  }

  cy.get(tid(`eto.public-view.investor-preview-banner`)).should("exist");
};

export const goToEtoViewById = (etoId: string, title?: string) => {
  cy.visit(etoPublicViewByIdLinkLegacy(etoId));

  assertEtoView(title);
};
