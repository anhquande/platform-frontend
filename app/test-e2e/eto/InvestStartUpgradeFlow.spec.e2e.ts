import { etoFixtureAddressByName, goToDashboard } from "../utils/index";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Start upgrade flow from investment", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    // TODO: you need another fixture that has ICBM wallet but is not upgraded in any other test
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

      cy.get(tid("investment-type.selector.ICBM_NEUR.enable-wallet")).click();

      // check if upgrade accept has shown
      cy.get(tid("modals.tx-sender.upgrade-flow.summery.upgradeSummary.accept")).should("exist");

      // TODO: Cover full flow with new fixture when available
    });
  });

  it("should not show non ICBM wallets when it's not allowed by investment", () => {
    const WHITELIST_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // verify ETO with disabled ETH wallet
      cy.get(tid(`eto-overview-${WHITELIST_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

      // ETH wallet should be unavailable in this ETO investment
      cy.get(tid("investment-type.selector.ETH")).should("not.exist");

      // close investment modal
      cy.get(tid("modal-close-button")).click();

      goToDashboard();
      // verify ETO with enabled ETH wallet
      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

      // ETH wallet should be unavailable in this ETO investment
      cy.get(tid("investment-type.selector.ETH")).should("exist");
      // it should not have enable wallet button
      cy.get(tid("investment-type.selector.ETH.enable-wallet")).should("not.exist");
    });
  });
});
