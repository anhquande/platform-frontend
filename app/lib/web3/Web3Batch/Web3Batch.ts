import { interfaces } from "inversify";
import * as Web3 from "web3";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../dependencies/logger";
import {
  Web3EthMethod,
  Web3EthMethodNames,
  Web3VersionMethod,
  Web3VersionMethodNames,
} from "../types";
import { web3AutoRetry } from "../Web3Retry/Web3Retry";

/**
 * Wrapper on top of web3 Batch API to execute batch request on the next event loop cycle
 */
class Web3AutoExecuteBatch {
  // TODO: Add correct typings when available in `web3-typescript-typings`
  private web3Batch: any;

  constructor(private web3: Web3, private logger: ILogger) {}

  add(request: Web3.JSONRPCRequestPayload): any {
    if (this.web3Batch === undefined) {
      this.web3Batch = (this.web3 as any).createBatch();
      // execute batch request on the next event loop
      setTimeout(this.execute, 0);
    }

    this.web3Batch.add(request);
  }

  private execute = () => {
    try {
      this.logger.info(
        `Number of web3 node rpc request batched: ${this.web3Batch.requests.length}`,
      );
      web3AutoRetry(this.web3Batch.execute.bind(this.web3Batch));
      this.web3Batch = undefined;
    } catch (e) {
      debugger;
    }
  };
}

/**
 * Extends Web3 by auto batching common ethereum RPC requests
 */
class Web3Batch extends Web3 {
  batch: Web3AutoExecuteBatch;

  constructor(
    provider: Web3.Provider,
    batchFactory: Web3BatchFactoryType,
    logger: ILogger,
    batchMethods: { versionMethods: Web3VersionMethodNames[]; ethMethods: Web3EthMethodNames[] },
  ) {
    super(provider);

    this.batch = batchFactory(this);

    batchMethods.versionMethods.forEach(
      method => (this.version[method] = this.forceBatchExecution(this.version[method])),
    );

    batchMethods.ethMethods.forEach(
      method => (this.eth[method] = this.forceBatchExecution(this.eth[method])),
    );

    logger.info("Web3 node rpc requests auto batching enabled");
  }

  private forceBatchExecution = (method: Web3EthMethod | Web3VersionMethod) => (...args: any[]) =>
    this.batch.add((method as any).request(...args));
}

type Web3BatchFactoryType = (web3: Web3) => Web3AutoExecuteBatch;

const web3BatchFactory: (context: interfaces.Context) => Web3BatchFactoryType = context => {
  const logger = context.container.get<ILogger>(symbols.logger);
  return (web3: Web3) => new Web3AutoExecuteBatch(web3, logger);
};

export { Web3AutoExecuteBatch, web3BatchFactory, Web3BatchFactoryType, Web3Batch };
