import * as React from "react";

import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { MoneyNew } from "../../../shared/formatters/Money";
import {
  ECurrency,
  EHumanReadableFormat,
  EMoneyInputFormat,
  ERoundingMode,
} from "../../../shared/formatters/utils";
import { ECurrencySymbol, getFormattedMoney, Money } from "../../../shared/Money.unsafe";

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
      inputFormat={EMoneyInputFormat.ULPS}
      moneyFormat={ECurrency.EUR}
      outputFormat={EHumanReadableFormat.FULL}
    />
  );
};

export { CalculatedFee };
