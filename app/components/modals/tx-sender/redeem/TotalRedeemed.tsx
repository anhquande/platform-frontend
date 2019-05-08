import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { multiplyBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { ECurrency, EMoneyInputFormat, ERoundingMode } from "../../../shared/formatters/utils";
import { ECurrencySymbol, getFormattedMoney, Money } from "../../../shared/Money.unsafe";

const TotalRedeemed: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
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
  const totalRedeemed = subtractBigNumbers([Q18.mul(providedAmount), calculatedFee]);

  return (
    <Money
      value={totalRedeemed}
      currencySymbol={ECurrencySymbol.CODE}
      currency={ECurrency.EUR}
      roundingMode={ERoundingMode.DOWN}
    />
  );
};

export { TotalRedeemed };
