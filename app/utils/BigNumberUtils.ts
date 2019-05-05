import BigNumber from "bignumber.js";

type BigNumberRepresentation = string | number | BigNumber;

/**
 * Add string as BigNumbers
 */
export const addBigNumbers = (numbers: BigNumberRepresentation[]): string =>
  numbers
    .reduce((acc: BigNumber, number) => acc.plus(new BigNumber(number)), new BigNumber(0))
    .toString();

/**
 * Subtract string as BigNumbers
 */
export const subtractBigNumbers = ([head, ...tail]: BigNumberRepresentation[]): string =>
  tail
    .reduce((acc: BigNumber, number) => acc.minus(new BigNumber(number)), new BigNumber(head))
    .toString();

/**
 * Multiply string as BigNumbers
 */
export const multiplyBigNumbers = (numbers: BigNumberRepresentation[]): string =>
  numbers
    .reduce((acc: BigNumber, number) => acc.mul(new BigNumber(number)), new BigNumber(1))
    .toString();

/**
 * Divide any number representation as BigNumbers
 */
export const divideBigNumbers = (
  dividend: BigNumberRepresentation,
  divisor: BigNumberRepresentation,
): string => new BigNumber(dividend).div(divisor).toString();

export const compareBigNumbers = (a: BigNumberRepresentation, b: BigNumberRepresentation): number =>
  new BigNumber(a).comparedTo(b);
