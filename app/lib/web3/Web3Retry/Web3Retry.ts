import { FAILED_REQUEST_WAIT_TIME, NUMBER_OF_ALLOWED_RETIRES } from "../../../config/constants";
import { delay } from "../../../utils/delay";
import { NodeNotRespondingError } from "./errors";

const web3AutoRetry = async <T, P, K>(
  web3Function: (arg1?: P, arg2?: K) => T,
  arg1?: P,
  arg2?: K,
): Promise<T> => {
  for (let i = 0; i < NUMBER_OF_ALLOWED_RETIRES; i++) {
    try {
      return web3Function(arg1, arg2);
    } catch (e) {
      if (e.contains("RPC")) {
        await delay(FAILED_REQUEST_WAIT_TIME);
        continue;
      } else {
        // If error is not Invalid Node Response
        throw e;
      }
    }
  }
  throw new NodeNotRespondingError();
};

export { web3AutoRetry };
