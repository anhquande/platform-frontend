import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { etoFixtureAddressByName, tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

const ETO_ID = etoFixtureAddressByName("ETONoStartDate");

describe("Eto Investor View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor", kyc: "business" }));

  it("should load empty Eto", () => {
    cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

    assertEtoView(
      "ETONoStartDate retail eto li security - Quintessence (QTT)",
      EJurisdiction.LIECHTENSTEIN,
    );
  });

  it("should display correct eto investment terms", () => {
    cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
    assertEtoView(
      "ETONoStartDate retail eto li security - Quintessence (QTT)",
      EJurisdiction.LIECHTENSTEIN,
    );

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
    cy.get(tid("eto-public-view-ticket-size")).should("contain", "100–5 000 000 EUR");
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
    assertEtoView("ETOInWhitelistState ff eto - Rich (RCH)", EJurisdiction.GERMANY);

    // TOKEN HOLDER RIGHTS section
    cy.get(tid("eto-public-view-token-transferability")).should("contain", "Yes");
    cy.get(tid("eto-public-view-token-tradability")).should("contain", "In the future");
  });
});
