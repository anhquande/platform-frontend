import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";
import { assertNever } from "../../../utils/assertNever";
import {
  EHumanReadableFormat,
  EMoneyInputFormat,
  ERoundingMode,
  ESpecialNumber,
  formatNumber,
} from "./utils";

import * as styles from "./FormatNumber.module.scss";

interface INumberRangeProps {
  valueFrom: string | BigNumber | number | undefined | null;
  valueUpto: string | BigNumber | number | undefined | null | ESpecialNumber;
  defaultValue?: string;
  decimalPlaces?: number;
  inputFormat?: EMoneyInputFormat;
  outputFormat?: EHumanReadableFormat;
  isPrice?: boolean;
  roundingMode?: ERoundingMode;
  separator?: string;
  className?: string;
}

const getSpecialNumberTranslation = (value: ESpecialNumber): TTranslatedString => {
  switch (value) {
    case ESpecialNumber.UNLIMITED: {
      return <FormattedMessage id="common.number-quantity.unlimited" />;
    }
    default:
      return assertNever(value);
  }
};

export const FormatNumberRange: React.FunctionComponent<INumberRangeProps> = ({
  valueFrom,
  valueUpto,
  defaultValue = "",
  roundingMode = ERoundingMode.UP,
  decimalPlaces = 4,
  inputFormat = EMoneyInputFormat.FLOAT,
  outputFormat = EHumanReadableFormat.FULL,
  isPrice = false,
  separator = "–", //todo nowrap before (?)
  className,
}) => {
  if (valueFrom && valueUpto) {
    const renderValueFrom = formatNumber({
      value: valueFrom,
      roundingMode,
      decimalPlaces,
      inputFormat,
      isPrice,
      outputFormat,
    });

    if (Object.values(ESpecialNumber).includes(valueUpto)) {
      return (
        <span className={cn(styles.noBreak, className)}>
          {renderValueFrom}
          {separator}
          {getSpecialNumberTranslation(valueUpto as ESpecialNumber)}
        </span>
      );
    } else {
      return (
        <span className={cn(styles.noBreak, className)}>
          {renderValueFrom}
          {separator}
          {formatNumber({
            value: valueUpto,
            roundingMode,
            decimalPlaces,
            inputFormat,
            outputFormat,
            isPrice,
          })}
        </span>
      );
    }
  } else {
    return <>{defaultValue}</>;
  }
};
