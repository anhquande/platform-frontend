import BigNumber from "bignumber.js";
import Web3Accounts from "web3-eth-accounts";

import { confirmAccessModal, goToDashboard, parseAmount } from "../utils";
import { getBalanceRpc, getTransactionByHashRpc } from "../utils/ethRpcUtils";
import { tid } from "../utils/selectors";
import { DEFAULT_PASSWORD, loginFixtureAccount } from "../utils/userHelpers";

const Q18 = new BigNumber(10).pow(18);
const NODE_ADDRESS = process.env.NF_RPC_PROVIDER!;

const assertWithdrawButtonIsDisabled = () =>
  cy
    .get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
    .should("be.disabled");

const typeWrongAddress = () => {
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type("0xCBD");
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).clear();
};

const typeWrongValue = () => {
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type("-1");
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type("df5");
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).clear();
};

export const checkTransactionWithRPCNode = (
  expectedTransaction: {
    expectedFrom: string;
    expectedInput: string;
    expectedGasLimit: string;
    writtenValue: string;
    expectedTo: string;
  },
  txHash: string,
) => {
  getTransactionByHashRpc(NODE_ADDRESS, txHash).then(data => {
    const { from, gas, input, hash, value } = data.body.result;
    const {
      expectedFrom,
      expectedInput,
      expectedGasLimit,
      writtenValue,
      expectedTo,
    } = expectedTransaction;

    const ethValue = new BigNumber(value).toString();

    expect(from).to.equal(expectedFrom);
    expect(hash).to.equal(txHash);
    expect(input).to.equal(expectedInput);
    expect(gas).to.equal(expectedGasLimit);
    expect(ethValue).to.equal(Q18.mul(writtenValue).toString());

    // TODO: Connect artifacts with tests to get deterministic addresses
    // expect(etherTokenAddress).to.equal(to);

    getBalanceRpc(NODE_ADDRESS, expectedTo).then(balance => {
      const receivedEtherValue = new BigNumber(balance.body.result).toString();
      expect(receivedEtherValue).to.equal(Q18.mul(writtenValue).toString());
    });
  });
};

describe("Wallet Withdraw", () => {
  it("should recover existing user with verified email from saved phrases and change email", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
      signTosAgreement: true,
      onlyLogin: true,
    }).then(() => {
      goToDashboard();

      const testValue = 5;
      const account = new Web3Accounts().create();
      const testAddress = account.address;

      const expectedInput = `0x64663ea6000000000000000000000000${testAddress
        .slice(2)
        .toLowerCase()}0000000000000000000000000000000000000000000000004563918244f40000`;

      cy.get(tid("authorized-layout-wallet-button")).awaitedClick();
      cy.get(tid("account-address.your.ether-address.from-div")).then(accountAddress => {
        cy.get(tid("wallet.eth.withdraw.button")).awaitedClick();
        /*Test Address field validation*/
        typeWrongAddress();
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(
          testAddress,
        );
        /*Test Address field validation*/
        typeWrongValue();
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(
          testValue.toString(),
        );
        cy.get(
          tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
        ).should("be.enabled");
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type("{enter}");

        /*Test flow*/

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.to")).should("contain", testAddress);
        cy.get(tid("modals.tx-sender.withdraw-flow.summary.value"))
          .then(e => parseAmount(e.text()).toNumber())
          .should("eq", testValue);

        // Disabled Due to the instability of gasPrice node
        // TODO: Enable after checking stability of gas price service
        // cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost"))
        // .then(e => parseAmount(e.text()).toNumber())
        // .should("be.closeTo", 0.0002, 0.0001);
        cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost")).contains(/0\.\d{4}/);

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

        confirmAccessModal(DEFAULT_PASSWORD);

        cy.get(tid("modals.shared.signing-message.modal"));
        cy.get(tid("modals.tx-sender.withdraw-flow.success"));

        cy.get(tid("modals.tx-sender.withdraw-flow.tx-hash")).then(txHashObject => {
          getTransactionByHashRpc(NODE_ADDRESS, txHashObject.text()).then(data => {
            const { from, input, hash, value } = data.body.result;

            const ethValue = new BigNumber(value).toString();

            expect(from).to.equal(accountAddress.text().toLowerCase());
            expect(txHashObject.text()).to.equal(hash);
            expect(input).to.equal(expectedInput);
            // do not check expected gas limit - any change in the solidity implementation will make test fail
            // expect(gas).to.equal(expectedGasLimit);
            expect(ethValue).to.equal(Q18.mul(0).toString());

            // TODO: Connect artifacts with tests to get deterministic addresses
            // expect(etherTokenAddress).to.equal(to);

            getBalanceRpc(NODE_ADDRESS, testAddress).then(balance => {
              const receivedEtherValue = new BigNumber(balance.body.result).toString();
              expect(receivedEtherValue).to.equal(Q18.mul(testValue).toString());
            });
          });
        });
      });
    });
  });
});
