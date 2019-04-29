import { includes, mapValues } from "lodash";
import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

import { ECountries } from "./countries.enum";

/**
 * Schema helpers
 * semi documented.... :)
 */
export const makeAllRequired = (schema: Yup.ObjectSchema<any>): Yup.ObjectSchema<any> => {
  const oldFields: { [key: string]: Yup.MixedSchema } = (schema as any).fields;
  const newFields = mapValues(oldFields, schema => schema.required());
  return Yup.object().shape(newFields);
};

/**
 * Date schema
 */
const DATE_SCHEME = "YYYY-M-D";
const parse = (s: string) => moment(s, DATE_SCHEME, true);

export const dateSchema = (v: Yup.StringSchema) =>
  v
    .transform(function(_value: any, originalValue: string): string {
      const date = parse(originalValue);
      if (!date.isValid()) {
        return "";
      }
      return date.format(DATE_SCHEME);
    })
    .test("is-valid", <FormattedMessage id="form.field.error.invalid-date" /> as any, s => {
      return parse(s).isValid();
    });

export const date = dateSchema(Yup.string());

export const personBirthDate = date
  .test("is-old-enough", <FormattedMessage id="form.field.error.older-than-18" /> as any, s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment().subtract(18, "years"));
  })
  .test(
    "is-young-enough",
    <FormattedMessage id="form.field.error.younger-than" values={{ age: 125 }} /> as any,
    s => {
      const d = parse(s);
      return d.isValid() && d.isAfter(moment().subtract(125, "years"));
    },
  );

export const foundingDate = date.test(
  "is-old-enough",
  <FormattedMessage id="form.field.error.founding-date-in-future" /> as any,
  s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment());
  },
);

export const citizen = Yup.bool();

export const isUsCitizen = citizen.test(
  "is-us-citizen",
  <FormattedMessage id="form.field.error.us-citizen" /> as any,
  response => response === false,
);

export const countryCode = Yup.string();
export const RESTRICTED_COUNTRIES = [
  ECountries.AFGHANISTAN,
  ECountries.AMERICAN_SAMOA,
  ECountries.BAHAMAS,
  ECountries.BOTSWANA,
  ECountries.ETHIOPIA,
  ECountries.GHANA,
  ECountries.GUAM,
  ECountries.IRAN,
  ECountries.IRAQ,
  ECountries.LIBYAN_ARAB_JAMAHIRIYA,
  ECountries.NIGERIA,
  ECountries.NORTH_KOREA,
  ECountries.PAKISTAN,
  ECountries.PANAMA,
  ECountries.PUERTO_RICO,
  ECountries.SERBIA,
  ECountries.SRI_LANKA,
  ECountries.SYRIAN_ARAB_REPUBLIC,
  ECountries.TRINIDAD_AND_TOBAGO,
  ECountries.TUNISIA,
  ECountries.UNITED_STATES,
  ECountries.VIRGIN_ISLANDS_US,
  ECountries.YEMEN,
];

export const restrictedCountry = countryCode.test(
  "country",
  <FormattedMessage id="form.field.error.restricted-country" /> as any,
  response => !includes(RESTRICTED_COUNTRIES, response),
);

export const percentage = Yup.number()
  .max(100, ((values: any) => (
    <FormattedMessage id="form.field.error.percentage.max" values={values} />
  )) as any)
  .min(0, ((values: any) => (
    <FormattedMessage id="form.field.error.percentage.min" values={values} />
  )) as any);
