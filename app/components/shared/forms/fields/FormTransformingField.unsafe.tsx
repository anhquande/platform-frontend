import * as cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";
import { isNonValid } from "./utils.unsafe";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  name: string;
  disabled?: boolean;
  label?: string | React.ReactNode;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  addonStyle?: string;
  maxLength?: number;
  ratio?: number;
  customValidation?: (value: any) => string | Function | Promise<void> | undefined;
}

type FieldGroupProps = IFieldGroup & CommonHtmlProps;

const transform = (value: number, ratio?: number) => {
  if (value && !Number.isNaN(value)) {
    // if user types in more than 100 percent (=> internal value is larger than 1),
    // value*ratio returns a weird number due to JS number rounding behavior
    // example: 1.11 * 100 === 111.00000000000001
    // here we manually check for this condition and round down the result
    const result = ratio !== undefined ? value * ratio : value;
    return value > 1 ? Math.floor(result) : result;
  } else {
    return "";
  }
};
const transformBack = (value: number, ratio?: number) => {
  const result = ratio !== undefined ? value / ratio : value;
  return value && !Number.isNaN(value) ? result : undefined;
};

export class FormTransformingField extends React.Component<FieldGroupProps> {
  render(): React.ReactNode {
    const {
      label,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      ratio,
      disabled,
      customValidation,
      maxLength,
    } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, setFieldValue, setFieldTouched, submitCount }) => {
          const invalid = isNonValid(touched, errors, name, submitCount);

          return (
            <FormGroup className={styles.keyValueField}>
              {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
              <Field
                name={name}
                validate={customValidation}
                render={({ field }: FieldProps) => (
                  <InputGroup>
                    {prefix && (
                      <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
                        {prefix}
                      </InputGroupAddon>
                    )}
                    <Input
                      {...field}
                      type="number"
                      aria-describedby={generateErrorId(name)}
                      aria-invalid={invalid}
                      invalid={invalid}
                      className={cn(className, styles.inputField)}
                      value={transform(field.value, ratio) || ""}
                      onChange={e => {
                        setFieldTouched(name);
                        setFieldValue(name, transformBack(e.target.valueAsNumber, ratio));
                      }}
                      placeholder={placeholder}
                      disabled={disabled}
                      maxLength={maxLength}
                    />
                    {suffix && (
                      <InputGroupAddon addonType="append" className={styles.addon}>
                        {suffix}
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                )}
              />
              <FormFieldError name={name} />
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
