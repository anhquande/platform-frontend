import * as cn from "classnames";
import { FormikConsumer } from "formik";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { isFieldRequired } from "./utils.unsafe";

import * as styles from "./FormFieldLabel.module.scss";

export type FormLabelExternalProps = {
  for: string;
};

export type FormFieldLabelExternalProps = {
  name: string;
};

const FormLabel: React.FunctionComponent<FormLabelExternalProps & CommonHtmlProps> = ({
  for: htmlFor,
  children,
  className,
}) => (
  <label htmlFor={htmlFor} className={cn(styles.formLabel, className)}>
    {children}
  </label>
);

const FormFieldLabel: React.FunctionComponent<CommonHtmlProps & FormFieldLabelExternalProps> = ({
  children,
  name,
  ...rawProps
}) => (
  <FormikConsumer>
    {({ validationSchema }) => {
      if (validationSchema) {
        return (
          <FormLabel for={name} {...rawProps}>
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
