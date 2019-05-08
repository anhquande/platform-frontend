import { IWindowWithData } from "../../../test/helperTypes";
import { IS_CYPRESS } from "../../config/constants";
import { compareBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Number.utils";
import { ECurrency } from "../shared/formatters/utils";

export const getRequiredAmount = (token: ECurrency) => {
  // In case of Cypress tests we have to return 0 by default to prevent tests with low amounts from crash
  // If there is data stored in window use it
  if (IS_CYPRESS) {
    const { payoutRequiredAmount } = window as IWindowWithData;
    return payoutRequiredAmount || "0";
  }

  switch (token) {
    case ECurrency.ETH: {
      return convertToBigInt(0.01);
    }
    case ECurrency.EUR_TOKEN: {
      return convertToBigInt(1);
    }
    default:
      return "0";
  }
};

export const shouldShowToken = (token: ECurrency, amount: string) => {
  const requiredAmount = getRequiredAmount(token);
  return compareBigNumbers(amount, requiredAmount) >= 0;
};
