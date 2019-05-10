import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { tid } from "../utils/selectors";

export const assertEtoView = (title?: string) => {
  cy.get(tid("eto.public-view")).should("exist");

  if (title) {
    cy.title().should("eq", title + " - Neufund Platform");
  }
};

export const goToEtoViewById = (etoId: string, title?: string) => {
  cy.visit(withParams(appRoutes.etoPublicViewById, { etoId }));

  assertEtoView(title)
};
