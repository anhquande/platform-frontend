import * as cn from "classnames";
import { FormikConsumer } from "formik";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { isFieldRequired } from "./utils.unsafe";

import * as styles from "./FormFieldLabel.module.scss";

export type FormLabelExternalProps = {
  for: string;
  inheritFont?: boolean;
};

export type FormFieldLabelExternalProps = {
  name: string;
  inheritFont?: boolean;
};

const FormLabel: React.FunctionComponent<FormLabelExternalProps & CommonHtmlProps> = ({
  for: htmlFor,
  children,
  className,
  inheritFont,
}) => (
  <label
    htmlFor={htmlFor}
    className={cn(styles.formLabel, className, { [styles.inheritFont]: inheritFont })}
  >
    {children}
  </label>
);

const FormFieldLabel: React.FunctionComponent<CommonHtmlProps & FormFieldLabelExternalProps> = ({
  children,
  name,
  inheritFont,
  ...rawProps
}) => (
  <FormikConsumer>
    {({ validationSchema }) => {
      if (validationSchema) {
        return (
          <FormLabel for={name} inheritFont={inheritFont} {...rawProps}>
            {children}
            {isFieldRequired(validationSchema, name) && <span aria-hidden="true"> *</span>}
          </FormLabel>
        );
      }

      return (
        <FormLabel for={name} {...rawProps}>
          {children}
        </FormLabel>
      );
    }}
  </FormikConsumer>
);

export { FormFieldLabel, FormLabel };
