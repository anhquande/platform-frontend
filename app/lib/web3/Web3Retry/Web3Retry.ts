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
      const returnedValue = await web3Function(arg1, arg2);
      return returnedValue;
    } catch (e) {
      debugger;

      if (e.contains("RPC")) {
        await delay(FAILED_REQUEST_WAIT_TIME);
        continue;
      }
    }
  }
  throw new NodeNotRespondingError();
};

export { web3AutoRetry };
