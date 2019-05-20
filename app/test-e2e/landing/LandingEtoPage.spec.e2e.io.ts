import { appRoutes } from "../../components/appRoutes";
import { tid } from "../utils";

describe("Eto Landing", () => {
  it("should work", () => {
    cy.visit(appRoutes.etoLanding);

    cy.title().should("eq", "Neufund Platform");
    cy.get(tid("landing-eto-page")).should("exist");
  });
});
