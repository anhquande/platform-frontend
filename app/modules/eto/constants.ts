import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { ECountries } from "../../lib/api/util/countries.enum";
import { minutesToMs } from "../../utils/Date.utils";

export const etoInProgressPoolingDelay = minutesToMs(1);
export const etoNormalPoolingDelay = minutesToMs(10);

// {USER_JURISDICTION: [Array of jurisdictions that should be hidden]}
export const hiddenJurisdictions: { [key: string]: EJurisdiction[] } = {
  [ECountries.GERMANY]: [],
  [ECountries.LIECHTENSTEIN]: [EJurisdiction.GERMANY],
};
