import BigNumber from "bignumber.js";
import { curry } from "lodash/fp";

import { Q18 } from "../config/constants";
import { TBigNumberVariant } from "../lib/web3/types";

export function isZero(value: string): boolean {
  const bigNumberValue = new BigNumber(value);

  return bigNumberValue.isZero();
}

export function convertToBigInt(value: TBigNumberVariant, currencyDecimals?: number): string {
  const q = currencyDecimals ? new BigNumber(10).pow(currencyDecimals) : Q18;
  const moneyInWei = q.mul(value);
  return moneyInWei.toFixed(0, BigNumber.ROUND_UP);
}
/*
 * @deprecated
 * */
export function formatFlexiPrecision(
  value: number | string,
  maxPrecision: number,
  minPrecision = 0,
  useGrouping = false,
): string {
  return parseFloat(value as string).toLocaleString(undefined, {
    maximumFractionDigits: maxPrecision,
    minimumFractionDigits: minPrecision,
    useGrouping,
  });
}

type TNormalizeOptions = { min: number; max: number };

function normalizeValue(options: TNormalizeOptions, value: number): number {
  const minAllowed = 0;
  const maxAllowed = 1;

  return (
    ((maxAllowed - minAllowed) * (value - options.min)) / (options.max - options.min) + minAllowed
  );
}

export const normalize = curry(normalizeValue);
