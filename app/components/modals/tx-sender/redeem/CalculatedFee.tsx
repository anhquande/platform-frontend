import * as React from "react";

import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { ECurrency, EMoneyInputFormat, ERoundingMode } from "../../../shared/formatters/utils";
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
          EMoneyInputFormat.FLOAT,
          false,
          ERoundingMode.HALF_UP,
        )
      : 0;
  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);

  return (
    <Money value={calculatedFee} currencySymbol={ECurrencySymbol.CODE} currency={ECurrency.EUR} />
  );
};

export { CalculatedFee };
