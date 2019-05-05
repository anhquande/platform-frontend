import * as cn from "classnames";
import { FormikConsumer, getIn } from "formik";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { isNonValid } from "./utils.unsafe";

import * as styles from "./FormFieldError.module.scss";

export interface IFormErrorExternalProps {
  name?: string;
  message: TTranslatedString;
  alignLeft?: boolean;
}

export interface IProps {
  name: string;
  defaultMessage?: TTranslatedString;
  ignoreTouched?: boolean;
  className?: string;
  alignLeft?: boolean;
  invalid?: boolean;
}

const generateErrorId = (name: string) => `${name}-error-message`;

const FormError: React.FunctionComponent<IFormErrorExternalProps & CommonHtmlProps> = ({
  message,
  name,
  className,
  alignLeft,
}) => (
  <div
    data-test-id={name && `form.${name}.error-message`}
    id={name && generateErrorId(name)}
    role="alert"
    className={cn(styles.errorLabel, { [styles.errorLabelAlignLeft]: alignLeft }, className)}
  >
    {message}
  </div>
);

const FormFieldError: React.FunctionComponent<IProps> = ({
  name,
  defaultMessage,
  ignoreTouched,
  className,
  alignLeft,
  invalid,
}) => (
  <FormikConsumer>
    {({ touched, errors, submitCount }) =>
      (isNonValid(touched, errors, name, submitCount, ignoreTouched) || invalid) && (
        <FormError
          name={name}
          message={getIn(errors, name) || defaultMessage}
          className={className}
          alignLeft={alignLeft}
        />
      )
    }
  </FormikConsumer>
);

export { FormFieldError, FormError, generateErrorId };
