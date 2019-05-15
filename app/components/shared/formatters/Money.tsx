import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { FormatNumber } from "./FormatNumber";
import { FormatShortNumber } from "./FormatShortNumber";
import {
  ECurrency,
  EHumanReadableFormat,
  EMoneyInputFormat,
  EPriceFormat,
  ERoundingMode,
  selectDecimalPlaces,
  TMoneyFormat,
} from "./utils";

import * as styles from "./Money.module.scss";

enum ECurrencySymbol {
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

interface IMoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | BigNumber | number | null | undefined;
}

interface IMoneyCommonProps {
  inputFormat: EMoneyInputFormat;
  moneyFormat: TMoneyFormat;
  roundingMode?: ERoundingMode;
  currencySymbol?: ECurrencySymbol;
  currencyClassName?: string;
  transfer?: EMoneyTransfer;
  theme?: ETheme;
  outputFormat: EHumanReadableFormat;
  defaultValue?: string;
  className?: string;
}

export const selectCurrencyCode = (moneyFormat: TMoneyFormat): string => {
  switch (moneyFormat) {
    case ECurrency.ETH:
    case EPriceFormat.EQUITY_TOKEN_PRICE_ETH:
      return "ETH";
    case ECurrency.NEU:
      return "NEU";
    case ECurrency.EUR:
    case EPriceFormat.EQUITY_TOKEN_PRICE_EURO:
    case EPriceFormat.SHARE_PRICE: //share prices are always in euro
      return "EUR";
    case ECurrency.EUR_TOKEN:
    case EPriceFormat.EQUITY_TOKEN_PRICE_EUR_TOKEN:
      return "nEUR";
    default:
      throw new Error("Unsupported money format");
  }
};

//todo will rename it to Money after the old money is gone
const MoneyNew: React.FunctionComponent<IMoneyProps & IMoneyCommonProps> = ({
  value,
  inputFormat,
  outputFormat,
  moneyFormat,
  currencySymbol = ECurrencySymbol.CODE,
  defaultValue = "-",
  currencyClassName,
  transfer,
  theme,
  className,
}) => {
  let formattedValue = null;
  if (value) {
    //todo: this should pass through 0 as well. Use isValidNumber from the #2687 PR when it's merged
    const decimalPlaces = selectDecimalPlaces(moneyFormat, outputFormat);
    formattedValue = Object.values(EHumanReadableFormat).includes(outputFormat) ? (
      <FormatNumber
        value={value}
        defaultValue={defaultValue}
        roundingMode={ERoundingMode.DOWN}
        decimalPlaces={decimalPlaces}
        inputFormat={inputFormat}
        outputFormat={outputFormat}
      />
    ) : (
      <FormatShortNumber
        value={value}
        inputFormat={inputFormat}
        defaultValue={defaultValue}
        roundingMode={ERoundingMode.DOWN}
        decimalPlaces={decimalPlaces}
        outputFormat={outputFormat}
      />
    );
  }
  return (
    <span className={cn(styles.money, transfer, className, theme)}>
      <span className={cn(styles.value)}>{formattedValue || defaultValue}</span>
      {currencySymbol === ECurrencySymbol.CODE && formattedValue !== null && (
        <span className={cn(styles.currency, currencyClassName)}>
          {" "}
          {selectCurrencyCode(moneyFormat)}
        </span>
      )}
    </span>
  );
};

export { MoneyNew, IMoneyCommonProps, EMoneyTransfer, ECurrencySymbol, ETheme };

/*
MONEY
take parseable string, ulps, bn,number or undefined
if undefined, show '-' or 0 (should be an option)
if string, make sure it's valid
if ulps - convert to float

options: isPrice, currency, class, class for currency

humanReadable
? call Number(
convert to string with rounding settings for resp currency
format thousands
)
: call HumanReadable()


isPrice ?& add currency code
-----------

MONEY RANGE
-//- but for range


*/
