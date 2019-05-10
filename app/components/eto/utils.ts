import { cloneDeep, flow, get, set } from "lodash";

import { formatFlexiPrecision } from "../../utils/Number.utils";

export interface ICompoundField {
  [x: string]: string | number | undefined;
}

//TODO remove it. Data should come from backend with all defaults set
export const applyDefaults = (data: any, defaults: any) => {
  const dataCopy = { ...data };

  return Object.keys(defaults).reduce((acc, key) => {
    if (acc[key] === undefined || acc[key] === null) {
      acc[key] = defaults[key];
    }
    return acc;
  }, dataCopy);
};

/**** DATA CONVERSION FUNCTIONS ****/

export const convert = (data: any, conversionSpec: any) => {
  if (data) {
    const dataCopy = cloneDeep(data);
    Object.keys(conversionSpec).forEach(key => {
      const fieldValue = get(dataCopy, key);
      set(dataCopy, key, convertField(fieldValue, conversionSpec[key]));
    });
    return dataCopy;
  } else {
    return data;
  }
};

const convertField = (input: any, f: any) => {
  if (Array.isArray(f)) {
    return flow(f)(input);
  } else {
    return input !== undefined && input !== null ? f(input) : input;
  }
};

export const convertInArray = (conversionSpec: any) => (data: any[]) => {
  if (Array.isArray(data)) {
    return data.map(element => convert(element, conversionSpec));
  } else {
    return data;
  }
};

const findNonEmptyKeyValueField = (data: ICompoundField | undefined) => {
  if (data) {
    const keys = Object.keys(data);

    return data[keys[0]] !== undefined && data[keys[1]] !== undefined;
  }

  return undefined;
};

//removes data left from empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueFields = () => (data: ICompoundField[] | undefined) => {
  if (data !== undefined && data !== null) {
    const cleanData = data.filter(field => findNonEmptyKeyValueField(field));
    return cleanData.length ? cleanData : undefined;
  } else {
    return undefined;
  }
};

//removes empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueField = () => (data: ICompoundField | undefined) =>
  findNonEmptyKeyValueField(data) ? data : undefined;

export const convertPercentageToFraction = () => (data: number) =>
  parseFloat((data / 100).toPrecision(4));

export const convertFractionToPercentage = () => (data: number) =>
  parseFloat((data * 100).toFixed(2));

export const parseStringToFloat = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseFloat(data);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const parseStringToInteger = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseInt(data, 10);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const convertToPrecision = (precision: number) => (data: number) => {
  if (data && !Number.isNaN(data)) {
    return parseFloat(formatFlexiPrecision(data, precision));
  } else {
    return undefined;
  }
};

export const setDefaultValueIfUndefined = (defaultValue: any) => (data: any) =>
  data === undefined ? defaultValue : data;

export const removeEmptyField = () => (data: any) => {
  if (data === [] || data === null || Number.isNaN(data)) {
    data = undefined;
  }
  return data;
};

// this is to generate unique keys
// that we supply to react elements when mapping over an array of data
export const generateKeys = () => (data: { key: string }[]) =>
  data &&
  data.map(arrayElement => {
    arrayElement.key = Math.random().toString();
    return arrayElement;
  });

// removes unique keys created with generateKeys()
// if API doesn't accept them
export const removeKeys = () => (data: { key: string }[]) =>
  data &&
  data.map(arrayElement => {
    delete arrayElement.key;
    return arrayElement;
  });
