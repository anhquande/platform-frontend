import { appRoutes } from "../../components/appRoutes";
import { e2eRoutes } from "../../components/testing/e2eRoutes";
import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { insecureWithParams, withParams } from "../../utils/withParams";
import { etoFixtureAddressByName, stubWindow, tid } from "../utils";
import { getEto } from "../utils/userHelpers";

// TODO: Get preview code deterministically
const etoPreviewLink = (previewCode: string, jurisdiction: string) =>
  new RegExp(
    insecureWithParams(appRoutes.etoPublicView, {
      previewCode,
      jurisdiction,
    }),
  );

describe("Eto widget page", () => {
  it("Basic widget", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState");
    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      stubWindow("windowOpen");

      cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

      cy.iframe("iframe").within(($iframe: any) => {
        cy.wrap($iframe)
          .find(tid("logged-out-campaigning-register"))
          .click();

        cy.get("@windowOpen").should("be.calledWithMatch", appRoutes.register, "_blank");

        cy.wrap($iframe)
          .find(tid("eto-overview-status-token"))
          .should("have.attr", "target", "_blank");

        cy.wrap($iframe)
          .find(tid("eto-overview-term-sheet-button"))
          .should("have.attr", "target", "_blank");

        cy.wrap($iframe)
          .find(tid("eto-overview-term-sheet-button"))
          .should("have.attr", "href")
          .and("match", etoPreviewLink(eto.previewCode, eto.product.jurisdiction));

        cy.wrap($iframe)
          .find(tid("eto-overview-prospectus-approved-button"))
          .should("have.attr", "target", "_blank");

        cy.wrap($iframe)
          .find(tid("eto-overview-prospectus-approved-button"))
          .should("have.attr", "href")
          .and("match", etoPreviewLink(eto.previewCode, eto.product.jurisdiction));

        cy.wrap($iframe)
          .find(tid("eto-overview-smart-contract-on-chain-button"))
          .should("have.attr", "target", "_blank");

        cy.wrap($iframe)
          .find(tid("eto-overview-smart-contract-on-chain-button"))
          .should("have.attr", "href")
          .and("match", etoPreviewLink(eto.previewCode, eto.product.jurisdiction));

        cy.wrap($iframe).find(tid("eto-overview-powered-by"));
      });
    });
  });

  it("ETOInSetupState", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState");

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    cy.iframe("iframe")
      .find(tid("logged-out-campaigning-register"))
      .click();

    cy.get("@windowOpen").should("be.calledWithMatch", appRoutes.register, "_blank");
  });

  it("ETOInWhitelistState", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    cy.iframe("iframe").find(tid("eto-whitelist-count-down"));
  });

  it("ETOInPublicState", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));
    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      cy.iframe("iframe")
        .find(tid("eto-widget-invest-now-button"))
        .click();

      cy.get("@windowOpen").should(
        "be.calledWithMatch",
        etoPreviewLink(eto.previewCode, eto.product.jurisdiction),
        "_blank",
      );
    });
  });

  it("ETONotFound", () => {
    const ETO_ID = "wrong-eto-id";

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    cy.iframe("iframe").find(tid("eto-widget-error"));
  });
});
