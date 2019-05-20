import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { MONEY_DECIMALS } from "../../config/constants";
import { formatMoney } from "../../utils/Money.utils";
import { selectCurrencyCode } from "./formatters/Money";
import { ECurrency, ENumberInputFormat, ERoundingMode } from "./formatters/utils";
import { NumberFormat } from "./NumberFormat";

import * as styles from "./Money.module.scss";

/*
 * @deprecated
 * */
enum ECurrencySymbol {
  SYMBOL = "symbol",
  CODE = "code",
  NONE = "none",
}

enum EMoneyTransfer {
  INCOME = styles.income,
  OUTCOME = styles.outcome,
}

enum ETheme {
  GREEN = styles.tGreen,
  ORANGE = styles.tOrange,
  GREEN_BIG = styles.tBigValue,
}

interface IOwnProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: ECurrency;
  value?: React.ReactElement<any> | string | BigNumber | number | null;
  format?: ENumberInputFormat;
  currencySymbol?: ECurrencySymbol;
  currencyClassName?: string;
  transfer?: EMoneyTransfer;
  theme?: ETheme;
  roundingMode?: ERoundingMode;
  /**
   * Use to represent token price (value is set to 8 decimal places)
   */
  isPrice?: boolean;
}

type IProps = IOwnProps;

const selectDecimalPlaces = (currency: ECurrency, isPrice?: boolean): number => {
  if (isPrice) {
    return 8;
  }

  switch (currency) {
    case ECurrency.ETH:
    case ECurrency.NEU:
      return 4;
    case ECurrency.EUR:
    case ECurrency.EUR_TOKEN:
      return 2;
  }
};

const selectCurrencySymbol = (currency: ECurrency): string => {
  switch (currency) {
    case ECurrency.EUR:
      return "€";
    default:
      throw new Error("Only EUR can be displayed as a symbol");
  }
};

/*
 * @deprecated
 * */
function getFormatDecimals(format: ENumberInputFormat): number {
  switch (format) {
    case ENumberInputFormat.ULPS:
      return MONEY_DECIMALS;
    case ENumberInputFormat.FLOAT:
      return 0;
    default:
      throw new Error("Unsupported money format");
  }
}
/*
 * @deprecated
 * Use app/components/shared/formatters/MoneyNew or app/components/shared/formatters/FormatNumber
 * */
export function getFormattedMoney(
  value: string | number | BigNumber,
  currency: ECurrency,
  format: ENumberInputFormat,
  isPrice?: boolean,
  roundingMode?: ERoundingMode,
): string {
  return formatMoney(
    value,
    getFormatDecimals(format),
    selectDecimalPlaces(currency, isPrice),
    roundingMode,
  );
}
/*
 * @deprecated
 * Use app/components/shared/formatters/MoneyNew
 * */
const Money: React.FunctionComponent<IProps> = ({
  value,
  format = ENumberInputFormat.ULPS,
  currency,
  currencyClassName,
  transfer,
  currencySymbol = ECurrencySymbol.CODE,
  theme,
  isPrice,
  roundingMode,
  ...props
}) => {
  if (!value) {
    return <>-</>;
  }

  const money =
    (format === ENumberInputFormat.ULPS && !React.isValidElement(value)) || isPrice
      ? getFormattedMoney(value as BigNumber, currency, format, isPrice, roundingMode)
      : value;
  const formattedMoney = !React.isValidElement(money) ? (
    <NumberFormat value={money as string} />
  ) : (
    money
  );

  return (
    <span {...props} className={cn(styles.money, transfer, props.className, theme)}>
      {currencySymbol === ECurrencySymbol.SYMBOL && (
        <span className={cn(styles.currency, currencyClassName)}>
          {selectCurrencySymbol(currency)}
        </span>
      )}
      <span className={cn(styles.value)}>{formattedMoney}</span>
      {currencySymbol === ECurrencySymbol.CODE && (
        <span className={cn(styles.currency, currencyClassName)}>
          {" "}
          {selectCurrencyCode(currency)}
        </span>
      )}
    </span>
  );
};

export {
  Money,
  selectCurrencySymbol,
  selectDecimalPlaces,
  EMoneyTransfer,
  ECurrencySymbol,
  ETheme,
};
