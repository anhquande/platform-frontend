import * as cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import {
  applyCharactersLimit,
  isNonValid,
  withCountedCharacters,
  withFormField,
} from "./utils.unsafe";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  charactersLimit?: number;
}
type FieldGroupProps = IFieldGroup & CommonHtmlProps;

const TextArea: React.FunctionComponent<FieldGroupProps> = ({
  disabled,
  placeholder,
  name,
  prefix,
  suffix,
  className,
  charactersLimit,
}) => (
  <FormikConsumer>
    {({ touched, errors, submitCount, setFieldTouched, setFieldValue }) => {
      const invalid = isNonValid(touched, errors, name, submitCount);

      return (
        <Field
          name={name}
          render={({ field }: FieldProps) => (
            <>
              <InputGroup>
                {prefix && (
                  <InputGroupAddon addonType="prepend" className={className}>
                    {prefix}
                  </InputGroupAddon>
                )}
                <Input
                  {...field}
                  type="textarea"
                  aria-describedby={generateErrorId(name)}
                  aria-invalid={invalid}
                  invalid={invalid}
                  disabled={disabled}
                  value={field.value}
                  placeholder={placeholder}
                  className={cn(className, styles.inputField)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldTouched(name);
                    setFieldValue(name, applyCharactersLimit(e.target.value, charactersLimit));
                  }}
                />
                {suffix && <InputGroupAddon addonType="append">{suffix}</InputGroupAddon>}
              </InputGroup>
              <FormFieldError name={name} />
              {charactersLimit && withCountedCharacters(field.value, charactersLimit)}
            </>
          )}
        />
      );
    }}
  </FormikConsumer>
);

export const FormTextArea = withFormField(TextArea);
