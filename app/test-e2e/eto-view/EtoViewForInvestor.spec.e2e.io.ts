import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { ISSUER_LISTED, ISSUER_PREVIEW } from "../fixtures";
import { etoFixtureAddressByName, tid } from "../utils";
import { goToEtoPreview } from "../utils/navigation";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView, assertIssuerEtoView } from "./EtoViewUtils";

const ETO_ID = etoFixtureAddressByName("ETONoStartDate");

describe("Eto Investor View", () => {
  describe("Default account tests", () => {
    beforeEach(() =>
      createAndLoginNewUser({ type: "investor", kyc: "business", signTosAgreement: true }),
    );

    it("should load empty Eto", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      assertEtoView("ETONoStartDate mini eto li - Quintessence (QTT)", EJurisdiction.LIECHTENSTEIN);
    });

    it("should display correct eto investment terms", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView("ETONoStartDate mini eto li - Quintessence (QTT)", EJurisdiction.LIECHTENSTEIN);

      // EQUITY section
      cy.get(tid("eto-public-view-pre-money-valuation")).should("contain", "132 664 672 EUR");
      cy.get(tid("eto-public-view-existing-shares")).should("contain", "40 976");
      cy.get(tid("eto-public-view-new-shares-to-issue")).should("contain", "1 000–3 452");
      cy.get(tid("eto-public-view-new-shares-to-issue-in-whitelist")).should("contain", "1 534");
      cy.get(tid("eto-public-view-new-share-price")).should("contain", "3 237.61 EUR");
      cy.get(tid("eto-public-view-whitelist-discount")).should("contain", "30%");
      cy.get(tid("eto-public-view-investment-amount")).should("contain", "2.2M–9.6M EUR");

      // TOKEN SALE section
      cy.get(tid("eto-public-view-tokens-per-share")).should("contain", "10 000");
      cy.get(tid("eto-public-view-token-price")).should("contain", "0.3237");
      cy.get(tid("eto-public-view-ticket-size")).should("contain", "10–5 000 000 EUR");
      cy.get(tid("eto-public-view-currencies")).should("contain", "ETH, nEUR");
      cy.get(tid("eto-public-view-pre-eto-duration")).should("contain", "7 Days");
      cy.get(tid("eto-public-view-public-eto-duration")).should("contain", "14 Days");

      // TOKEN HOLDER RIGHTS section
      cy.get(tid("eto-public-view-nominee")).should("contain", "Neumini NOMINEE_NEUMINI");
      cy.get(tid("eto-public-view-public-offer-duration")).should("contain", "14 Days");
      cy.get(tid("eto-public-view-token-transferability")).should("contain", "No");
      cy.get(tid("eto-public-view-asset-type")).should("contain", "Security");
      cy.get(tid("eto-public-view-voting-rights")).should("contain", "Yes");
      cy.get(tid("eto-public-view-dividend-rights")).should("contain", "Yes");
    });

    it("should should tradability when transferability is set to true", () => {
      const ETO_ID_WITH_TRANSFERABILITY_ALLOWED = etoFixtureAddressByName("ETOInWhitelistState");

      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID_WITH_TRANSFERABILITY_ALLOWED));
      assertEtoView("ETOInWhitelistState hnwi eto de security - Rich (RCH)", EJurisdiction.GERMANY);

      // TOKEN HOLDER RIGHTS section
      cy.get(tid("eto-public-view-token-transferability")).should("contain", "Yes");
      cy.get(tid("eto-public-view-token-tradability")).should("contain", "In the future");
    });
  });

  describe("Fixtures tests", () => {
    it("coming soon state should have pitch deck", () => {
      createAndLoginNewUser({
        type: "issuer",
        seed: ISSUER_PREVIEW,
        signTosAgreement: true,
        hdPath: "m/44'/60'/0'/0",
      }).then(() => {
        goToEtoPreview();
        assertIssuerEtoView();

        cy.get(tid("eto-overview-pitch-deck-button"))
          .should("exist")
          .should("have.attr", "href");
        // This ETO has product id set so token terms should be available
        cy.get(tid("eto-public-view-token-terms")).should("exist");
      });
    });

    it("listed state", () => {
      createAndLoginNewUser({
        type: "issuer",
        seed: ISSUER_LISTED,
        signTosAgreement: true,
        hdPath: "m/44'/60'/0'/0",
      }).then(() => {
        goToEtoPreview();
        assertIssuerEtoView();

        cy.get(tid("eto-overview-pitch-deck-button"))
          .should("exist")
          .should("exist")
          .should("have.attr", "href");
        cy.get(tid("eto-public-view-token-terms")).should("exist");
      });
    });
  });
});
