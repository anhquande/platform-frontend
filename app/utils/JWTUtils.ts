import * as Moment from "moment";

import { MAX_EXPIRATION_DIFF_MINUTES } from "../config/constants";

interface IJwt {
  exp: number;
  permissions?: {
    [name: string]: number;
  };
}

/**
 * Gets expiration date
 */
export function getJwtExpiryDate(token: string): Moment.Moment {
  try {
    const parsedJwt = parseJwt(token);
    return Moment.unix(parsedJwt.exp);
  } catch (e) {
    throw new Error(`Cannot parse JWT token: ${token}`);
  }
}

/**
 * Checks if JWT expiration date is further in past than MAX_EXPIRATION_DIFF_MINUTES minutes
 */
export function isJwtExpiringLateEnough(token: string): boolean {
  try {
    const expirationDate = getJwtExpiryDate(token);
    const expirationDiff = expirationDate.diff(Moment(), "minutes");
    return expirationDiff >= MAX_EXPIRATION_DIFF_MINUTES;
  } catch (e) {
    throw new Error(`Cannot parse JWT token: ${token}`);
  }
}

/**
 * Parse a jwt into a json object
 */
export function parseJwt(token: string): IJwt {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

/**
 * Check whether token is still valid
 */
export function isValid(token: string): boolean {
  try {
    const now = Date.now() / 1000;

    const { exp } = parseJwt(token);

    return exp > now;
  } catch {
    return false;
  }
}

/**
 * Check whether permissions are valid
 */
export function hasValidPermissions(token: string, permissions: Array<string>): boolean {
  try {
    const now = Date.now() / 1000;

    const { permissions: currentPermissions } = parseJwt(token);

    if (permissions.length === 0) return true;

    if (!currentPermissions) return false;

    return permissions.every(p => !!currentPermissions[p] && currentPermissions[p] > now);
  } catch {
    return false;
  }
}
