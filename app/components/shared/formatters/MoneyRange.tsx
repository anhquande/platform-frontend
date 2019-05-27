import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { FormatNumberRange } from "./FormatNumberRange";
import { FormatShortNumberRange } from "./FormatShortNumber";
import { ECurrencySymbol, IMoneyCommonProps, selectCurrencyCode } from "./Money";
import {
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  ESpecialNumber,
  selectDecimalPlaces,
} from "./utils";

import * as styles from "./MoneyNew.module.scss";

interface IMoneyRangeProps {
  valueFrom: string | BigNumber | number | null | undefined;
  valueUpto: string | BigNumber | number | null | undefined | ESpecialNumber;
  separator?: string;
}

export const MoneyRange: React.FunctionComponent<
  IMoneyRangeProps & IMoneyCommonProps & CommonHtmlProps
> = ({
  valueFrom,
  valueUpto,
  inputFormat = ENumberInputFormat.ULPS,
  outputFormat = ENumberOutputFormat.FULL,
  moneyFormat,
  currencySymbol = ECurrencySymbol.CODE,
  defaultValue = "-",
  separator = "–",
  currencyClassName,
  transfer,
  theme,
  className,
}) => {
  let formattedValue = null;

  if (valueFrom && valueUpto) {
    //fixme should pass through 0 but not invalid vals
    formattedValue =
      outputFormat === ENumberOutputFormat.FULL ||
      outputFormat === ENumberOutputFormat.ONLY_NONZERO_DECIMALS ||
      outputFormat === ENumberOutputFormat.INTEGER ? (
        <FormatNumberRange
          valueFrom={valueFrom}
          valueUpto={valueUpto}
          inputFormat={inputFormat}
          outputFormat={outputFormat}
          decimalPlaces={selectDecimalPlaces(moneyFormat, outputFormat)}
          roundingMode={ERoundingMode.DOWN}
          separator={separator}
        />
      ) : (
        <FormatShortNumberRange
          valueFrom={valueFrom}
          valueUpto={valueUpto}
          inputFormat={inputFormat}
          outputFormat={outputFormat}
          decimalPlaces={selectDecimalPlaces(moneyFormat, outputFormat)}
          roundingMode={ERoundingMode.DOWN}
          separator={separator}
        />
      );
  }

  return (
    <span className={cn(styles.money, transfer, className, theme)}>
      <span className={cn(styles.value)}>{formattedValue || defaultValue}</span>
      {formattedValue && currencySymbol === ECurrencySymbol.CODE && (
        <span className={cn(styles.currency, currencyClassName)} data-test-id="units">
          {" "}
          {selectCurrencyCode(moneyFormat)}
        </span>
      )}
    </span>
  );
};

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
