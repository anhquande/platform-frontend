import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { EHumanReadableFormat, EMoneyInputFormat, ERoundingMode, formatNumber } from "./utils";

import * as styles from "./FormatNumber.module.scss";

interface IComponentProps {
  value: string | BigNumber | number | undefined | null;
  defaultValue?: string;
  roundingMode: ERoundingMode;
  decimalPlaces?: number;
  inputFormat: EMoneyInputFormat;
  outputFormat: EHumanReadableFormat;
  className?: string;
}

export const FormatNumber: React.FunctionComponent<IComponentProps> = ({
  value,
  defaultValue = "",
  roundingMode,
  decimalPlaces = 4,
  inputFormat,
  outputFormat = EHumanReadableFormat.FULL,
  className,
}) => {
  if (value) {
    return (
      <span className={cn(styles.noBreak, className)}>
        {formatNumber({ value, inputFormat, outputFormat, roundingMode, decimalPlaces })}
      </span>
    );
  } else {
    return <span>{defaultValue}</span>;
  }
};
