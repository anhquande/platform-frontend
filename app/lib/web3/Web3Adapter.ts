import { BigNumber } from "bignumber.js";
import * as Web3 from "web3";

import { makeEthereumAddressChecksummed } from "../../modules/web3/utils";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";
import { delay } from "../../utils/delay";
import { promisify } from "../../utils/promisify";
import { ethMethodsToBatch, versionMethodsToBatch } from "./Web3Factory/Web3Factory";
import { web3AutoRetry } from "./Web3Retry/Web3Retry";

class Web3Error extends Error {}
export class NotEnoughEtherForGasError extends Error {}
export class RevertedTransactionError extends Web3Error {}
export class OutOfGasError extends Web3Error {}
export class NotEnoughFundsError extends Web3Error {}

export class EthNodeError extends Error {}
export class LowGasNodeError extends EthNodeError {}
export class LowNonceError extends EthNodeError {}
export class LongTransactionQueError extends EthNodeError {}
export class InvalidRlpDataError extends EthNodeError {}
export class InvalidChangeIdError extends EthNodeError {}
export class UnknownEthNodeError extends EthNodeError {}

enum TRANSACTION_STATUS {
  REVERTED = "0x0",
  SUCCESS = "0x1",
}

/**
 * Layer on top of raw Web3js. Simplifies API for common operations. Adds promise support.
 * Note that some methods may be not supported correctly by exact implementation of your client
 */
export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  // Web3 Eth methods
  private getAccountAddressFunction = promisify<EthereumAddress[]>(this.web3.eth.getAccounts);
  private getBalanceFunction = promisify<BigNumber>(this.web3.eth.getBalance);
  private estimateGasFunction = promisify<number>(this.web3.eth.estimateGas);
  private signFunction = promisify<string>(this.web3.eth.sign);
  private getTransactionReceiptFunction = promisify<Web3.TransactionReceipt>(
    this.web3.eth.getTransactionReceipt,
  );
  private getTransactionByHashFunction = promisify<Web3.Transaction>(this.web3.eth.getTransaction);
  private getTransactionCountFunction = promisify<number>(this.web3.eth.getTransactionCount);
  private sendRawTransactionFunction = promisify<string>(this.web3.eth.sendRawTransaction);
  private sendTransactionFunction = promisify<string>(this.web3.eth.sendTransaction);
  private getBlockNumberFunction = promisify<number>(this.web3.eth.getBlockNumber);
  // Web3 Version methods
  private getNetwork = promisify<EthereumNetworkId>(this.web3.version.getNetwork.bind(this.web3));

  public async getNetworkId(): Promise<EthereumNetworkId> {
    // Check if method is already in the batching que
    return (await versionMethodsToBatch.some(method => method === "getNetwork"))
      ? this.getNetwork()
      : web3AutoRetry(() => this.getNetwork());
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return ethMethodsToBatch.some(method => method === "getBalance")
      ? this.getBalanceFunction(address)
      : web3AutoRetry(() => this.getBalanceFunction(address));
  }

  public async estimateGas(txData: Partial<Web3.TxData>): Promise<number> {
    return ethMethodsToBatch.some(method => method === "estimateGas")
      ? this.estimateGasFunction(txData)
      : web3AutoRetry(() => this.estimateGasFunction(txData));
  }

  public async getAccountAddress(): Promise<EthereumAddress> {
    return ethMethodsToBatch.some(method => method === "getAccounts")
      ? (await this.getAccountAddressFunction())[0]
      : (await web3AutoRetry(() => this.getAccountAddressFunction()))[0];
  }

  // returns mixed case checksummed ethereum address according to: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  public async getAccountAddressWithChecksum(): Promise<EthereumAddressWithChecksum> {
    const address = await this.getAccountAddress();
    return makeEthereumAddressChecksummed(address);
  }

  public async ethSign(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: string,
  ): Promise<string> {
    return ethMethodsToBatch.some(method => method === "sign")
      ? this.signFunction(address, data)
      : web3AutoRetry(this.signFunction, address, data);
  }

  // Not Added to Auto Retry on Failed RPC
  public async signTypedData(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: ITypedDataToSign[],
  ): Promise<string> {
    const send = promisify<any>(
      this.web3.currentProvider.sendAsync.bind(this.web3.currentProvider),
    ); // web3 typings are not accurate here

    const resultData = await send({
      method: "eth_signTypedData",
      params: [data, address as string],
      from: address as string,
    });

    if (resultData.error !== undefined) {
      /*
       Sane thing is to throw Error but here result.error contain object with message and code fields.
       We could create own error but here it's gonna get more complicated when we will support more browser wallets as
       those have different API's and returned objects may differ
      */
      throw resultData.error;
    }

    return resultData.result;
  }

  public async getTransactionReceipt(txHash: string): Promise<Web3.TransactionReceipt | null> {
    return await web3AutoRetry(() => this.getTransactionReceiptFunction(txHash));
  }

  public async getTransactionByHash(txHash: string): Promise<Web3.Transaction> {
    return await web3AutoRetry(() => this.getTransactionByHashFunction(txHash));
  }

  public async getTransactionCount(address: string): Promise<number> {
    return await web3AutoRetry(() => this.getTransactionCountFunction(address));
  }

  /**
   * This will ensure that txData has nonce value.
   */
  public async sendRawTransaction(txData: string): Promise<string> {
    return await web3AutoRetry(() => this.sendRawTransactionFunction(txData));
  }

  /**
   * This will ensure that txData has nonce value.
   */
  public async sendTransaction(txData: Web3.TxData): Promise<string> {
    // we manually add nonce value if needed
    // later it's needed by backend
    if (txData.nonce === undefined) {
      txData.nonce = await this.getTransactionCount(txData.from);
    }

    return await this.sendTransactionFunction(txData);
  }

  /**
   * Get information about transactions (from `web3.eth.getTransaction`) or `null` when transaction is pending
   * throws OutOfGasError or RevertedTransactionError in case of transaction not mined successfully
   */
  public async getTransactionOrThrow(txHash: string): Promise<Web3.Transaction | null> {
    const tx = await this.getTransactionByHash(txHash);
    const txReceipt = await this.getTransactionReceipt(txHash);

    // Both requests `getTx` and `getTransactionReceipt` can end up in two seperate nodes
    const isMined = tx && tx.blockNumber && txReceipt && txReceipt.blockNumber;
    if (!isMined) {
      return null;
    }

    if (txReceipt!.status === TRANSACTION_STATUS.REVERTED) {
      if (txReceipt!.gasUsed === tx.gas) {
        // All gas is burned in this case
        throw new OutOfGasError();
      }
      throw new RevertedTransactionError();
    }

    return tx;
  }

  public async waitForTx(options: IWaitForTxOptions): Promise<Web3.Transaction> {
    // TODO: Refactor Wait for TX
    return new Promise<Web3.Transaction>((resolve, reject) => {
      this.watchNewBlock(async blockId => {
        try {
          if (options.onNewBlock) {
            await options.onNewBlock(blockId);
          }

          const tx = await this.getTransactionOrThrow(options.txHash);

          if (!tx) {
            return;
          }

          resolve(tx);
          return true;
        } catch (e) {
          reject(e);
        }
      }).catch(reject);
    });
  }

  // onNewBlock should return true to finish observing
  public async watchNewBlock(
    onNewBlock: (blockId: number) => Promise<boolean | void>,
  ): Promise<void> {
    let lastBlockId = -1;

    while (true) {
      const currentBlockNo = await this.getBlockNumber();
      if (lastBlockId !== currentBlockNo) {
        lastBlockId = currentBlockNo;

        const isFinished = await onNewBlock(lastBlockId);

        if (isFinished) {
          break;
        }
      }

      await delay(3000);
    }
  }

  public async getBlockNumber(): Promise<number> {
    return this.getBlockNumberFunction();
  }
}

interface IWaitForTxOptions {
  txHash: string;
  onNewBlock?: (blockId: number) => Promise<void>;
}

interface ITypedDataToSign {
  type: string; // todo: here we could use more specific type. Something like "string" | "uint32" etc.
  name: string;
  value: string;
}
