import * as React from "react";

import { TTranslatedString } from "../../types";
import {
  ECurrency,
  EHumanReadableFormat,
  EMoneyInputFormat,
  ERoundingMode,
  formatNumber,
  isEmptyValue,
  isValidNumber,
  parseInputToNumber,
  selectDecimalPlaces,
  stripNumberFormatting,
  toFixedPrecision,
} from "./formatters/utils";
import { FormInputRaw } from "./forms/fields/FormInputRaw.unsafe";

interface IProps {
  name: string;
  inputFormat: EMoneyInputFormat;
  currency: ECurrency;
  value: string;
  onChangeFn: (value: string) => void;
  returnInvalidValues?: boolean;
  setError?: (v: boolean) => void;
  placeholder?: TTranslatedString;
  "data-test-id"?: string;
  suffix?: string;
  errorMsg?: TTranslatedString;
  invalid?: boolean;
}

export class MaskedMoneyInput extends React.Component<IProps> {
  decimals = selectDecimalPlaces(this.props.currency);

  formatValue = (value: string): string => {
    if (isEmptyValue(value)) {
      return "";
    } else if (isValidNumber(value)) {
      return toFixedPrecision({
        value,
        roundingMode: ERoundingMode.DOWN,
        inputFormat: EMoneyInputFormat.FLOAT,
        decimalPlaces: this.decimals,
      });
    } else {
      return value;
    }
  };

  formatForDisplay = (value: string | undefined, inputFormat: EMoneyInputFormat) =>
    value !== undefined && value !== ""
      ? formatNumber({
          value,
          inputFormat,
          roundingMode: ERoundingMode.DOWN,
          decimalPlaces: this.decimals,
          outputFormat: EHumanReadableFormat.ONLY_NONZERO_DECIMALS,
        })
      : "";

  state = {
    value: this.formatForDisplay(this.props.value, this.props.inputFormat),
  };

  formatOnChange = (value: string, stateValue: string | undefined) => {
    const decimals = value.split(".")[1];

    if (decimals !== undefined && decimals.length > this.decimals) {
      /*ignore last character if we already have max decimal places, otherwise round value*/
      return stateValue && value.startsWith(stateValue) ? stateValue : this.formatValue(value);
    } else {
      return value;
    }
  };

  changeValue = (value: string) => {
    const validValue: string | null = parseInputToNumber(value);

    if (validValue !== null) {
      const newValue = this.formatOnChange(validValue, this.state.value);
      if (newValue !== this.state.value) {
        this.setState({ value: newValue });
        this.props.onChangeFn(newValue);
        this.props.setError && this.props.setError(false);
      }
    } else if (value !== this.state.value) {
      this.setState({ value });
      this.props.onChangeFn(Boolean(this.props.returnInvalidValues) ? value : "");
      this.props.setError && this.props.setError(true);
    }
  };

  onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.changeValue(e.clipboardData.getData("text"));
  };

  onBlur = (value?: string) => {
    if (isEmptyValue(value) || isValidNumber(value)) {
      this.setState({ value: this.formatForDisplay(value, this.props.inputFormat) });
    }
  };

  onFocus = (value?: string) => {
    if (isEmptyValue(value) || isValidNumber(value)) {
      this.setState({ value: value && stripNumberFormatting(value) });
    } else {
      this.setState({ value });
    }
  };

  hasFocus = (id: string) => !!document.activeElement && document.activeElement.id === id;

  componentDidUpdate(): void {
    if (isValidNumber(this.props.value) || isEmptyValue(this.props.value)) {
      const propsValue = this.formatForDisplay(this.props.value, this.props.inputFormat);
      if (!this.hasFocus(this.props.name) && propsValue !== this.state.value) {
        this.setState({ value: propsValue });
      }
    }
  }

  render(): React.ReactNode {
    return (
      <FormInputRaw
        value={this.state.value}
        name={this.props.name}
        data-test-id={this.props["data-test-id"]}
        placeholder={this.props.placeholder}
        suffix={this.props.suffix}
        errorMsg={this.props.errorMsg}
        invalid={this.props.invalid}
        onBlur={(e: React.ChangeEvent<HTMLInputElement>) => this.onBlur(e.target.value)}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => this.onFocus(e.target.value)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.changeValue(e.target.value)}
        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => this.onPaste(e)}
      />
    );
  }
}

//TODO add api calls error handling
