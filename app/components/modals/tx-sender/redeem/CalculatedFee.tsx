import * as React from "react";

import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { MoneyNew } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
} from "../../../shared/formatters/utils";
import { getFormattedMoney } from "../../../shared/Money.unsafe";

const CalculatedFee: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
  amount,
  bankFee,
}) => {
  const providedAmount =
    !isNaN(Number(amount)) && Number(amount) > 0
      ? getFormattedMoney(
          amount,
          ECurrency.EUR,
          ENumberInputFormat.FLOAT,
          false,
          ERoundingMode.HALF_UP,
        )
      : 0;
  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);

  return (
    <MoneyNew
      value={calculatedFee}
      inputFormat={ENumberInputFormat.ULPS}
      moneyFormat={ECurrency.EUR}
      outputFormat={ENumberOutputFormat.FULL}
    />
  );
};

export { CalculatedFee };
