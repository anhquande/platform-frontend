import BigNumber from "bignumber.js";
import Web3Accounts from "web3-eth-accounts";

import { NODE_ADDRESS } from "../config";
import { cyPromise } from "./cyPromise";

export enum ETransactionStatus {
  SUCCESS = "0x1",
  REVERTED = "0X0",
}

const requestFromWeb3Node = (methodName: string, params: string[] | object[]) =>
  cy.request({
    url: NODE_ADDRESS,
    method: "POST",
    body: {
      jsonrpc: "2.0",
      method: methodName,
      params,
      id: 1,
    },
  });

export const getTransactionByHashRpc = (txHash: string) =>
  requestFromWeb3Node("eth_getTransactionByHash", [txHash]);

export const getTransactionReceiptRpc = (txHash: string) =>
  requestFromWeb3Node("eth_getTransactionReceipt", [txHash]);

export const getBalanceRpc = (address: string) =>
  requestFromWeb3Node("eth_getBalance", [address, "latest"]);

export const getNonceRpc = (address: string) =>
  requestFromWeb3Node("eth_getTransactionCount", [address, "latest"]);

export const getChainIdRpc = () => requestFromWeb3Node("net_version", []);

export const sendRawTransactionRpc = (data: string) =>
  requestFromWeb3Node("eth_sendRawTransaction", [data]);

export const getTransactionReceipt = (hash: string) =>
  requestFromWeb3Node("eth_getTransactionReceipt", [hash]);

export const withdrawAllEth = (privateKey: string, to: string) => {
  const account = new Web3Accounts(NODE_ADDRESS).privateKeyToAccount(privateKey);

  getBalanceRpc(account.address).then(balanceResponse => {
    const valueToSend = new BigNumber(balanceResponse.body.result).minus(21000);

    if (valueToSend.greaterThan(0)) {
      cy.log("Withdrawing ethereum");

      cyPromise(() =>
        account.signTransaction({
          to,
          value: valueToSend.toFixed(),
          gas: 21000,
          gasPrice: 1,
        }),
      ).then((signed: any) => {
        sendRawTransactionRpc(signed.rawTransaction);

        cy.log("All ethereum withdrawn");
      });
    } else {
      cy.log("Nothing to withdraw");
    }
  });
};
