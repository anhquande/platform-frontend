import { EEtoFormTypes } from "../../../modules/eto-flow/types";
import { EEtoState } from "./EtoApi.interfaces.unsafe";

export const etoFormIsReadonly = (formName: EEtoFormTypes, etoState?: EEtoState) => {
  const readOnlyForms = [
    EEtoFormTypes.EtoEquityTokenInfo,
    EEtoFormTypes.EtoTerms,
    EEtoFormTypes.EtoVotingRights,
    EEtoFormTypes.EtoInvestmentTerms,
  ];
  return etoState !== EEtoState.PREVIEW && readOnlyForms.includes(formName);
};

const findSchemaConstraint = (schema: any, constraintName: string) => {
  const schemaTest = schema && schema.tests.find((test: any) => test.TEST_NAME === constraintName);
  return schemaTest && schemaTest.TEST.params[constraintName];
};

export const findMin = (schema: any) => {
  return findSchemaConstraint(schema, "min");
};

export const findMax = (schema: any) => {
  return findSchemaConstraint(schema, "max");
};
