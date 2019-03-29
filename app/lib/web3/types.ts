import BigNumber from "bignumber.js";
import * as Web3 from "web3";

import { SelectPropertyNames } from "../../types";

export interface ITxData {
  to: string;
  value: string;
  data?: string;
  from: string;
  input?: string;
  gas: string;
  gasPrice: string;
}

export interface IRawTxData extends ITxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export type TBigNumberVariant = number | string | BigNumber;

// Web3 Provider Methods
export type Web3VersionMethodNames = SelectPropertyNames<Web3.VersionApi, Function>;
export type Web3VersionMethod = Web3.VersionApi[Web3VersionMethodNames];

export type Web3EthMethodNames = SelectPropertyNames<Web3.EthApi, Function>;
export type Web3EthMethod = Web3.EthApi[Web3EthMethodNames];
