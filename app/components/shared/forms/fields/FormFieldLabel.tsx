import * as cn from "classnames";
import { connect } from "formik";
import * as React from "react";
import { compose, shouldUpdate } from "recompose";

import { CommonHtmlProps, TFormikConnect } from "../../../../types";
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

const FormFieldLabelLayout: React.FunctionComponent<
  CommonHtmlProps & FormFieldLabelExternalProps & TFormikConnect
> = ({ children, name, formik, ...rawProps }) => {
  if (formik.validationSchema) {
    return (
      <FormLabel for={name} {...rawProps}>
        {children}
        {isFieldRequired(formik.validationSchema, name) && <span aria-hidden="true"> *</span>}
      </FormLabel>
    );
  }

  return (
    <FormLabel for={name} {...rawProps}>
      {children}
    </FormLabel>
  );
};

const FormFieldLabel = compose<
  FormFieldLabelExternalProps & TFormikConnect,
  FormFieldLabelExternalProps
>(
  connect,
  // Do not rerender until either name or schema changes
  shouldUpdate<FormFieldLabelExternalProps & TFormikConnect>(
    (props, nextProps) =>
      props.name !== nextProps.name ||
      props.formik.validationSchema !== nextProps.formik.validationSchema,
  ),
)(FormFieldLabelLayout);

export { FormFieldLabel, FormLabel };
