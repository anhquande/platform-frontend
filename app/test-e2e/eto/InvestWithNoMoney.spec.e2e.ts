import { ETHEREUM_ZERO_ADDRESS } from "../../config/constants";
import { goToEtoViewById } from "../eto-view/EtoViewUtils";
import { INV_EMPTY_HAS_KYC, INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_HAS_NEUR_AND_NO_ETH } from "../fixtures";
import { etoFixtureAddressByName } from "../utils";
import { withdrawAllEth } from "../utils/ethRpcUtils";
import { goToDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Try and invest without money", () => {
  it("should keep invest button disabled", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EMPTY_HAS_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // click invest now button
      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("10");

      cy.wait(1000);

      cy.get(tid("invest-modal-invest-now-button")).should("be.disabled");
    });
  });

  it("should show error message when there is no enough ether for gas during neur investment", () => {
    withdrawAllEth(INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_HAS_NEUR_AND_NO_ETH, ETHEREUM_ZERO_ADDRESS);

    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_HAS_NEUR_AND_NO_ETH,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    });

    goToEtoViewById(PUBLIC_ETO_ID);

    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

    cy.get(tid("investment-type.selector.ICBM_NEUR")).check({ force: true });

    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type("1000");

    cy.get(tid("form.euroValue.error-message")).should("exist");
    cy.get(tid("invest-modal-invest-now-button")).should("be.disabled");
  });
});
