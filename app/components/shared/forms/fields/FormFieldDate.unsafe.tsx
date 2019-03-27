import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { TTranslatedString } from "../../../../types";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import { isNonValid } from "./utils.unsafe";

import * as styles from "./FormFieldDate.module.scss";

interface IProps {
  disabled?: boolean;
  label: TTranslatedString;
  name: string;
  "data-test-id"?: string;
}

const positionMap = {
  year: 0,
  month: 1,
  day: 2,
};

type FieldDateType = "year" | "month" | "day";

export class FormFieldDate extends React.Component<IProps> {
  cache = {
    day: "",
    month: "",
    year: "",
  };

  monthInput?: HTMLInputElement;
  saveMonthRef = (ref: HTMLInputElement) => {
    this.monthInput = ref;
  };
  yearInput?: HTMLInputElement;
  saveYearRef = (ref: HTMLInputElement) => {
    this.yearInput = ref;
  };

  onChange = (
    type: FieldDateType,
    e: React.FormEvent<HTMLInputElement>,
    handler: (e: React.FormEvent<HTMLInputElement>) => void,
  ) => {
    this.cache[type] = e.currentTarget.value;
    e.currentTarget.value = `${this.cache.year}-${this.cache.month}-${this.cache.day}`;

    handler(e);
  };

  fromValue = (type: FieldDateType, value: string = ""): string => {
    const items = value.split("-");
    this.cache[type] = items.length === 3 ? items[positionMap[type]] : "";
    return this.cache[type];
  };

  render(): React.ReactNode {
    const { name, label, "data-test-id": dataTestId, disabled } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, submitCount }: any) => {
          const invalid = isNonValid(touched, errors, name, submitCount, undefined);

          return (
            <FormGroup>
              <div className={styles.dateField} data-test-id={dataTestId}>
                <span className={styles.label}>{label}</span>
                <div className={styles.inputsWrapper}>
                  <Field
                    name={name}
                    render={({ field }: FieldProps) => {
                      return (
                        <div className={styles.inputWrapper}>
                          <Input
                            {...field}
                            data-test-id="form-field-date-day"
                            aria-describedby={generateErrorId(name)}
                            aria-invalid={invalid}
                            invalid={invalid}
                            disabled={disabled}
                            onChange={e => {
                              this.onChange("day", e, field.onChange);
                              // auto advance to next field
                              const realValue = this.fromValue("day", e.target.value);
                              if (realValue.length === 2) {
                                this.monthInput!.focus();
                              }
                            }}
                            value={this.fromValue("day", field.value)}
                            placeholder="DD"
                            maxLength={2}
                          />
                        </div>
                      );
                    }}
                  />
                  {"/"}
                  <Field
                    name={this.props.name}
                    render={({ field }: FieldProps) => (
                      <div>
                        <Input
                          {...field}
                          data-test-id="form-field-date-month"
                          aria-describedby={generateErrorId(name)}
                          aria-invalid={invalid}
                          invalid={invalid}
                          disabled={disabled}
                          onChange={e => {
                            this.onChange("month", e, field.onChange);
                            // auto advance to next field
                            const realValue = this.fromValue("month", e.target.value);
                            if (realValue.length === 2) {
                              this.yearInput!.focus();
                            }
                          }}
                          value={this.fromValue("month", field.value)}
                          placeholder="MM"
                          maxLength={2}
                          innerRef={this.saveMonthRef}
                        />
                      </div>
                    )}
                  />
                  {"/"}
                  <Field
                    name={this.props.name}
                    render={({ field }: FieldProps) => (
                      <div className={styles.dateFieldYear}>
                        <Input
                          {...field}
                          data-test-id="form-field-date-year"
                          aria-describedby={generateErrorId(name)}
                          aria-invalid={invalid}
                          invalid={invalid}
                          disabled={disabled}
                          onChange={e => this.onChange("year", e, field.onChange)}
                          value={this.fromValue("year", field.value)}
                          placeholder="YYYY"
                          maxLength={4}
                          innerRef={this.saveYearRef}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
              <FormFieldError name={name} />
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
