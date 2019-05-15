import BigNumber from "bignumber.js";
import { findLast, floor } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";
import { EHumanReadableFormat, EMoneyInputFormat, ERoundingMode, toFixedPrecision } from "./utils";

enum ERangeKey {
  THOUSAND = "thousand",
  MILLION = "million",
}

type TRangeDescriptor = {
  divider: number;
  key: ERangeKey;
};

interface IProps {
  value: string | BigNumber | number | undefined | null;
  outputFormat?: EHumanReadableFormat;
  inputFormat?: EMoneyInputFormat;
  decimalPlaces?: number;
  divider?: number;
  defaultValue?: string;
  roundingMode?: ERoundingMode;
  className?: string;
  isPrice?: boolean;
}

interface IRangeProps {
  valueFrom: string | BigNumber | number | undefined | null;
  valueUpto: string | BigNumber | number | undefined | null;
  outputFormat?: EHumanReadableFormat;
  inputFormat?: EMoneyInputFormat;
  decimalPlaces?: number;
  divider?: number;
  defaultValue?: string;
  roundingMode?: ERoundingMode;
  className?: string;
  isPrice?: boolean;
  separator?: string;
}

const ranges: TRangeDescriptor[] = [
  { divider: 1e3, key: ERangeKey.THOUSAND },
  { divider: 1e6, key: ERangeKey.MILLION },
];

const translationKeys = {
  [ERangeKey.MILLION]: {
    [EHumanReadableFormat.LONG]: (
      <FormattedMessage id="shared-component.to-human-readable-form.million.long" />
    ),
    [EHumanReadableFormat.SHORT]: (
      <FormattedMessage id="shared-component.to-human-readable-form.million.short" />
    ),
  },
  [ERangeKey.THOUSAND]: {
    [EHumanReadableFormat.LONG]: (
      <FormattedMessage id="shared-component.to-human-readable-form.thousand.long" />
    ),
    [EHumanReadableFormat.SHORT]: (
      <FormattedMessage id="shared-component.to-human-readable-form.thousand.short" />
    ),
  },
};

function getRange(number: number, divider?: number): TRangeDescriptor | undefined {
  if (divider) {
    return ranges.find(range => range.divider === divider);
  }

  return findLast(ranges, range => number / range.divider >= 1);
}

const FormatShortNumber: React.FunctionComponent<IProps> = ({
  value,
  defaultValue = "",
  roundingMode = ERoundingMode.UP,
  decimalPlaces = 4,
  inputFormat = EMoneyInputFormat.FLOAT,
  outputFormat = EHumanReadableFormat.LONG,
  isPrice,
  className,
  divider,
}) => {
  if (!value) {
    return <span className={className}>{defaultValue}</span>;
  }

  const number = parseFloat(
    toFixedPrecision({ value, roundingMode, inputFormat, decimalPlaces, isPrice, outputFormat }),
  );
  const range = getRange(number, divider);
  if (range) {
    const shortValue = floor(number / range.divider, 1).toString();

    const translation = (translationKeys[range.key] as {
      [key in EHumanReadableFormat]: TTranslatedString
    })[outputFormat];

    return (
      <span className={className}>
        {shortValue}
        {outputFormat === EHumanReadableFormat.LONG && " "}
        {translation}
      </span>
    );
  } else {
    return <span className={className}>{number.toString()}</span>;
  }
};

export const FormatShortNumberRange: React.FunctionComponent<IRangeProps> = ({
  valueFrom,
  valueUpto,
  defaultValue = "",
  roundingMode = ERoundingMode.UP,
  decimalPlaces = 4,
  outputFormat = EHumanReadableFormat.LONG,
  inputFormat = EMoneyInputFormat.FLOAT,
  className,
  divider,
  separator = "—",
}) => {
  if (valueFrom && valueUpto) {
    return (
      //todo 1.nowrap before ndash 2. let user choose if it's a span or a <> (?)
      // todo add unlimited
      <span className={className}>
        <FormatShortNumber
          value={valueFrom}
          outputFormat={outputFormat}
          divider={divider}
          decimalPlaces={decimalPlaces}
          roundingMode={roundingMode}
          inputFormat={inputFormat}
        />
        {separator}
        <FormatShortNumber
          value={valueUpto}
          outputFormat={outputFormat}
          divider={divider}
          decimalPlaces={decimalPlaces}
          roundingMode={roundingMode}
          inputFormat={inputFormat}
        />
      </span>
    );
  } else {
    return <>{defaultValue}</>;
  }
};

export { FormatShortNumber };
