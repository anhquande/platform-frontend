import BigNumber from "bignumber.js";

import { MONEY_DECIMALS } from "../../../config/constants";
import { invariant } from "../../../utils/invariant";

export enum ERoundingMode {
  UP = "up",
  DOWN = "down",
  HALF_UP = "half_up",
  HALF_DOWN = "half_down",
}

export enum EMoneyInputFormat {
  ULPS = "ulps",
  FLOAT = "float",
}

export enum ECurrency {
  NEU = "neu",
  EUR = "eur",
  EUR_TOKEN = "eur_t",
  ETH = "eth",
}

export enum EPriceFormat {
  EQUITY_TOKEN_PRICE_ETH = "equityTokenPriceEth",
  EQUITY_TOKEN_PRICE_EURO = "equityTokenPriceEuro",
  EQUITY_TOKEN_PRICE_EUR_TOKEN = "equityTokenPriceEuroToken",
  SHARE_PRICE = "sharePrice",
}

export enum EHumanReadableFormat {
  LONG = "long",
  SHORT = "short",
  INTEGER = "integer",
  ONLY_NONZERO_DECIMALS = "onlyNonzeroDecimals", // see removeZeroDecimals unit test
  FULL = "full",
}

export type TMoneyFormat = ECurrency | EPriceFormat;

interface IToFixedPrecision {
  value: string | BigNumber | number;
  roundingMode?: ERoundingMode;
  inputFormat?: EMoneyInputFormat;
  decimalPlaces: number | undefined;
  isPrice?: boolean;
  outputFormat?: EHumanReadableFormat;
}

interface IFormatNumber {
  value: string | BigNumber | number;
  roundingMode?: ERoundingMode;
  inputFormat?: EMoneyInputFormat;
  decimalPlaces?: number;
  isPrice?: boolean;
  outputFormat?: EHumanReadableFormat;
}

export const selectDecimalPlaces = (
  moneyFormat: TMoneyFormat,
  outputFormat: EHumanReadableFormat = EHumanReadableFormat.FULL,
): number => {
  if (outputFormat !== EHumanReadableFormat.FULL) {
    return 0;
  }

  switch (moneyFormat) {
    case EPriceFormat.SHARE_PRICE:
    case ECurrency.EUR:
    case ECurrency.EUR_TOKEN:
      return 2;
    case EPriceFormat.EQUITY_TOKEN_PRICE_ETH:
    case EPriceFormat.EQUITY_TOKEN_PRICE_EURO:
    case EPriceFormat.EQUITY_TOKEN_PRICE_EUR_TOKEN:
    case ECurrency.ETH:
    case ECurrency.NEU:
    default:
      return 4;
  }
};

export const convertFromUlps = (value: BigNumber, baseFactor: number) =>
  value.div(new BigNumber(10).pow(baseFactor));

export function formatThousands(value?: string): string {
  // todo remove optionality. This function should accept string only. Leave for now for backward compat.
  if (!value) return "";
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, "Can't format this number: " + value);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return `${formattedBeforeDot}.${splitByDot[1]}`;
  }
  return formattedBeforeDot;
}

export const removeZeroDecimals = (value: string): string => {
  const splitByDot = value.split(".");
  invariant(splitByDot.length <= 2, "Can't format this number: " + value);
  if (splitByDot[1] !== undefined && splitByDot[1].match(/^0+$/g)) {
    return splitByDot[0];
  } else {
    return value;
  }
};

//TODO sorry for any. Bignumber doesn't expose RoundingMode so there's no easy solution for it
function getBigNumberRoundingMode(
  roundingMode: ERoundingMode,
  outputFormat: EHumanReadableFormat = EHumanReadableFormat.FULL,
): any {
  switch (roundingMode) {
    case ERoundingMode.DOWN:
      return BigNumber.ROUND_DOWN;
    case ERoundingMode.HALF_DOWN:
      return BigNumber.ROUND_HALF_DOWN;
    case ERoundingMode.HALF_UP:
      return BigNumber.ROUND_HALF_UP;
    case ERoundingMode.UP:
    default:
      return outputFormat === EHumanReadableFormat.INTEGER
        ? BigNumber.ROUND_HALF_DOWN
        : BigNumber.ROUND_UP;
  }
}

export const toFixedPrecision = ({
  value,
  roundingMode = ERoundingMode.UP,
  inputFormat = EMoneyInputFormat.ULPS,
  decimalPlaces = undefined,
  outputFormat = EHumanReadableFormat.FULL,
}: IToFixedPrecision): string => {
  const dp = outputFormat === EHumanReadableFormat.INTEGER ? 0 : decimalPlaces;
  const asBigNumber = value instanceof BigNumber ? value : new BigNumber(value.toString());

  const moneyInPrimaryBase =
    inputFormat === EMoneyInputFormat.ULPS
      ? convertFromUlps(asBigNumber, MONEY_DECIMALS)
      : asBigNumber;
  return moneyInPrimaryBase.toFixed(dp, getBigNumberRoundingMode(roundingMode, outputFormat));
};

/* formatNumber only formats numbers (!),
 * invalid input (null/undefined etc) should be handled before calling this fn, this one will only throw.
 * we don't check for strings in a wrong format here,
 * since 99% of input vals is from the store so it should be in the right format already,
 * and user input should handle this on its own before calling this fn
 * */
/* SHORT and LONG formats are not handled by this fn, it's the job of the FormatShortNumber components */
export const formatNumber = ({
  value,
  roundingMode = ERoundingMode.UP,
  inputFormat = EMoneyInputFormat.ULPS,
  decimalPlaces,
  outputFormat = EHumanReadableFormat.FULL,
}: IFormatNumber): string => {
  invariant(
    value !== null &&
      (typeof value === "string" || typeof value === "number" || value instanceof BigNumber) &&
      !(typeof value === "string" && value.trim() === "") &&
      !(typeof value === "number" && (Number.isNaN(value) || !Number.isFinite(value))),
    "cannot format this number",
  );

  const asFixedPrecisionNumber = toFixedPrecision({
    value,
    roundingMode,
    inputFormat,
    outputFormat,
    decimalPlaces,
  });

  return outputFormat === EHumanReadableFormat.ONLY_NONZERO_DECIMALS
    ? formatThousands(removeZeroDecimals(asFixedPrecisionNumber))
    : formatThousands(asFixedPrecisionNumber);
};

export const parseInputToNumber = (val: string | undefined): string | null => {
  if (!val || val.trim() === "") {
    return "";
  }

  let value = val.trim().replace(/\s/g, "");

  if (val.match(/^\d+$/)) {
    return value;
  }

  const digits = value.match(/\d|,|\./g);
  if (digits === null || digits.length < value.length) {
    /* there are non-digit and non-separator characters: 123a,123 */
    return null;
  }

  if (value.match(/^(\d+([.,]))+\d+$/) === null) {
    /* 123. | 123, | ,123 | .123 | 123..123 | 123,,123 | 123.,123 */
    return null;
  }

  const periods = value.match(/\./g);
  const commas = value.match(/,/g);
  if (periods && periods.length > 1 && commas && commas.length > 1) {
    /* 213.324.234,43,8 */
    return null;
  }
  if (value.match(/\d+\.\d+,\d+\./g) || value.match(/\d+,\d+\.\d+,/g)) {
    return null; /* 123.123,123.123 || 123,123.123,123 */
  }
  if (periods && commas && (value.match(/(,\d+){2,}$/) || value.match(/(\.\d+){2,}$/))) {
    return null; /*123.123,123,123 | 123,123.123.123 */
  }
  if (periods && periods.length === 1 && commas && commas.length === 1) {
    /* 222.222,22 | 222,222.22 */
    value = value.replace(/([.,])(?=\d+$)/, ".");
    value = value.replace(/(^\d+)([.,])/, "$1");
  }

  if (periods && periods.length > 1) {
    /* 213.213.44 thousands separators */
    value = value.replace(/\./g, "");
  } else if (periods && periods.length === 1) {
    /* 222.22 decimal sep */
    // do nothing
  }

  if (commas && commas.length > 1) {
    /* 213,213,44 thousands separators */
    value = value.replace(/,/g, "");
  } else if (commas && commas.length === 1) {
    /* 222,22 decimal sep */
    value = value.replace(/,/g, ".");
  }

  return value;
};

/* this is only to check if the user input/formik value is empty */
export const isEmptyValue = (val: string | undefined) => val === undefined || val.trim() === "";

export const isValidNumber = (val: string | undefined) => {
  if (!val) {
    return false;
  }
  const value = val.trim().replace(/\s/g, "");

  return value.match(/^\d+([.,]\d+)?$/) !== null;
};

export const stripNumberFormatting = (value: string) => {
  if (isEmptyValue(value)) {
    return "";
  } else if (isValidNumber(value)) {
    // remove whitespaces and trailing zeroes from decimal part if it's there
    const splitValue = value.replace(/ /g, "").split(".");
    invariant(
      splitValue.length === 1 || splitValue.length === 2,
      `stripNumberFormatting: Can't handle this input: " ${value}`,
    );

    if (splitValue.length === 2) {
      const trimmedValue = splitValue[1].replace(/0+$/, "");
      return trimmedValue.length ? `${splitValue[0]}.${trimmedValue}` : splitValue[0];
    } else {
      return splitValue.join(".");
    }
  } else {
    return value;
  }
};