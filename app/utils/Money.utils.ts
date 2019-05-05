import BigNumber from "bignumber.js";

import { invariant } from "./invariant";

export enum ERoundingMode {
  UP = "up",
  DOWN = "down",
  HALF_UP = "half_up",
  HALF_DOWN = "half_down",
}

export function formatToFixed(
  moneyInPrimaryBase: BigNumber,
  decimalPlaces: number,
  roundingMode?: ERoundingMode,
): string {
  switch (roundingMode) {
    case ERoundingMode.DOWN:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_DOWN);
    case ERoundingMode.HALF_DOWN:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_HALF_DOWN);
    case ERoundingMode.HALF_UP:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_HALF_UP);
    case ERoundingMode.UP:
    default:
      return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_UP);
  }
}

/**
 * Formats number to desired decimals and precision.
 * IMPORTANT: Use only for display in UI, not for token calculations in business logic!
 */
export function formatMoney(
  value: string | BigNumber | number,
  currencyDecimals: number,
  decimalPlaces?: number,
  roundingMode?: ERoundingMode,
): string {
  //convert value to string to avoid 'more than 15 chars' error
  const money = value instanceof BigNumber ? value : new BigNumber(value.toString());
  const moneyInPrimaryBase = money.div(new BigNumber(10).pow(currencyDecimals));
  return decimalPlaces !== undefined
    ? formatToFixed(moneyInPrimaryBase, decimalPlaces, roundingMode)
    : moneyInPrimaryBase.toString();
}

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
    /* there are non-digit and non-separator characters :123a,123 */
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

export const isValidNumberOrEmpty = (val: string | undefined) => {
  if (val === undefined || val.trim() === "") {
    return true;
  }
  const value = val.trim().replace(/\s/g, "");

  return value.match(/^\d+([.,]\d+)?$/) !== null;
};

export const stripNumberFormatting = (value: string) => {
  if (isValidNumberOrEmpty(value)) {
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
