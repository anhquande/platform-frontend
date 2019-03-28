import { interfaces } from "inversify";
import * as Web3 from "web3";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../dependencies/logger";
import { Web3EthMethodNames, Web3VersionMethodNames } from "../types";
import { Web3Batch, Web3BatchFactoryType } from "../Web3Batch/Web3Batch";

type Web3FactoryType = (provider: Web3.Provider) => Web3;

// Add methods to batch manually here
const versionMethodsToBatch: Web3VersionMethodNames[] = ["getNetwork"];
const ethMethodsToBatch: Web3EthMethodNames[] = ["call", "getCode", "getBalance", "estimateGas"];

const web3Factory: (context: interfaces.Context) => Web3FactoryType = context => {
  const logger = context.container.get<ILogger>(symbols.logger);
  const batchFactory = context.container.get<Web3BatchFactoryType>(symbols.web3BatchFactory);

  return (provider: Web3.Provider) =>
    new Web3Batch(provider, batchFactory, logger, {
      versionMethods: versionMethodsToBatch,
      ethMethods: ethMethodsToBatch,
    });
};
export { web3Factory, Web3FactoryType, versionMethodsToBatch, ethMethodsToBatch };
