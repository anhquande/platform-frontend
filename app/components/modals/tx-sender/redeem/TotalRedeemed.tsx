import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { multiplyBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { MoneyNew } from "../../../shared/formatters/Money";
import {
  ECurrency,
  EHumanReadableFormat,
  EMoneyInputFormat,
  isEmptyValue,
  isValidNumber,
} from "../../../shared/formatters/utils";

const TotalRedeemed: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
  amount,
  bankFee,
}) => {
  const providedAmount = isValidNumber(amount) || (isEmptyValue(amount) && 0) ? amount : 0;
  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);
  const totalRedeemed = subtractBigNumbers([Q18.mul(providedAmount), calculatedFee]);

  return (
    <MoneyNew
      value={totalRedeemed}
      inputFormat={EMoneyInputFormat.ULPS}
      moneyFormat={ECurrency.EUR}
      outputFormat={EHumanReadableFormat.ONLY_NONZERO_DECIMALS}
    />
  );
};

export { TotalRedeemed };
