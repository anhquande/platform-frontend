import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { tid } from "../utils/selectors";

export const assertEtoView = (title: string, jurisdiction?: EJurisdiction) => {
  cy.get(tid("eto.public-view")).should("exist");
  cy.title().should("eq", title + " - Neufund Platform");
  if (jurisdiction) {
    cy.url().should("contain", jurisdiction);
  }
};
