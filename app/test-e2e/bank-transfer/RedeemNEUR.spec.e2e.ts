import BigNumber from "bignumber.js";

import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  formatNumber,
  selectDecimalPlaces,
  stripNumberFormatting,
} from "../../components/shared/formatters/utils";
import { INV_ICBM_ETH_M_HAS_KYC_DUP_HAS_NEURO } from "../fixtures";
import { fillForm } from "../utils/forms";
import {
  acceptWallet,
  assertWallet,
  closeModal,
  confirmAccessModal,
  getWalletNEurAmount,
  goToPortfolio,
  goToWallet,
  parseAmount,
} from "../utils/index";
import { formField, tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertBankAccountDetails } from "./assertions";

describe.skip("Redeem NEUR", () => {
  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ICBM_ETH_M_HAS_KYC_DUP_HAS_NEURO,
      hdPath: "m/44'/60'/0'/0",
    }).then(() => {
      // go to portfolio and claim neur before all tests
      goToPortfolio();

      cy.get(tid(`asset-portfolio.payout-eur_t`)).within(() => {
        // accept neur payout
        cy.get(tid("asset-portfolio.payout.accept-payout")).click();
      });

      // accept summary
      cy.get(tid("investor-payout.accept-summary.accept")).click();
      confirmAccessModal();

      // wait for success
      cy.get(tid("investor-payout.accept-success"));
      closeModal();

      // assert that payout is removed from the list
      cy.get(tid(`asset-portfolio.payout-eur_t`)).should("not.exist");
    });
  });

  beforeEach(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ICBM_ETH_M_HAS_KYC_DUP_HAS_NEURO,
      hdPath: "m/44'/60'/0'/0",
    }).then(() => {
      // store actual balance
      getWalletNEurAmount().as("currentAmount");

      assertWallet();

      // check if bank account is linked
      assertBankAccountDetails();

      // start redeem flow
      cy.get(tid("wallet-balance.neur.redeem-button")).click();
    });
  });

  it("should not allow to use value below 5 NEUR", () => {
    fillForm(
      {
        amount: "2.22",
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");
  });

  it("should not allow to use value above NEUR balance", () => {
    fillForm(
      {
        amount: "9999999999.99",
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");
  });

  it("should correctly format input", () => {
    const value = "-3s32aa@fax2.24@#2535%s9sf92";

    fillForm(
      {
        amount: value,
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");

    const nextValue = "123456789.99";

    fillForm(
      {
        amount: nextValue,
      },
      { submit: false },
    );

    const nextExpectedValue = formatNumber({
      value: nextValue,
      outputFormat: ENumberOutputFormat.FULL,
      inputFormat: ENumberInputFormat.FLOAT,
      decimalPlaces: selectDecimalPlaces(ECurrency.EUR),
    });

    cy.get(formField("amount")).should("have.value", nextExpectedValue);
  });

  it("should withdraw 20 nEUR", () => {
    fillForm({
      amount: "20",
      "bank-transfer.reedem-init.continue": { type: "submit" },
    });

    // check if value is the same in summary
    cy.get(tid("bank-transfer.redeem-summary.return-amount")).then($el => {
      const redeemedAmount = parseAmount(stripNumberFormatting($el.text()));

      expect(redeemedAmount).to.be.bignumber.eq(20);
    });

    // continue transaction
    cy.get(tid("bank-transfer.redeem-summary.continue")).click();
    acceptWallet();

    // go to wallet
    cy.get(tid("bank-transfer.redeem.success.go-to-wallet")).click();

    // refresh page instead of waiting to have data updated
    goToWallet();

    // check if balance is subtracted by 20
    getWalletNEurAmount(false).then(actualAmount => {
      cy.get<BigNumber>("@currentAmount").then(previousAmount => {
        expect(previousAmount.minus(actualAmount)).to.bignumber.bignumber.eq(20);
      });
    });
  });

  it("should withdraw whole balance", () => {
    // click redeem whole balance button
    cy.get(tid("bank-transfer.reedem-init.redeem-whole-balance")).click();

    fillForm({
      "bank-transfer.reedem-init.continue": { type: "submit" },
    });

    // check if value is the same in summary
    cy.get(tid("bank-transfer.redeem-summary.return-amount")).then($el => {
      const redeemedAmount = parseAmount(stripNumberFormatting($el.text()));

      cy.get<BigNumber>("@currentAmount").then(previousAmount => {
        expect(previousAmount).to.bignumber.bignumber.eq(redeemedAmount);
      });
    });

    // continue transaction
    cy.get(tid("bank-transfer.redeem-summary.continue")).click();
    acceptWallet();

    // go to wallet
    cy.get(tid("bank-transfer.redeem.success.go-to-wallet")).click();

    // refresh page instead of waiting to have data updated
    goToWallet();

    // check if balance is 0
    getWalletNEurAmount(false).then(actualAmount => {
      expect(actualAmount).to.bignumber.bignumber.eq(0);
    });
  });
});
