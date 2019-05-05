import { BigNumber } from "bignumber.js";
import * as React from "react";

import { MONEY_DECIMALS } from "../../config/constants";
import { TTranslatedString } from "../../types";
import {
  isValidNumberOrEmpty,
  parseInputToNumber,
  stripNumberFormatting,
} from "../../utils/Money.utils";
import { formatThousands } from "../../utils/Number.utils";
import { FormInputRaw } from "./forms/fields/FormInputRaw.unsafe";
import { ECurrency } from "./Money.unsafe";

interface IProps {
  name: string;
  currency: ECurrency;
  value: string | undefined;
  dispatchFn: (value: string) => void;
  setError: (v: boolean) => void;
  placeholder?: TTranslatedString;
  "data-test-id"?: string;
  suffix?: string;
  errorMsg?: TTranslatedString;
  invalid?: boolean;
}

export class MaskedMoneyInput extends React.Component<IProps> {
  moneyToPrimaryBase = (value: string | BigNumber | number, currencyDecimals: number) => {
    const money = value instanceof BigNumber ? value : new BigNumber(value.toString());
    return money.div(new BigNumber(10).pow(currencyDecimals)).toString();
  };

  formatMoney = (value: string, decimalPlaces: number): string => {
    if (isValidNumberOrEmpty(value)) {
      const money = new BigNumber(stripNumberFormatting(value));
      return decimalPlaces !== undefined
        ? money.toFixed(decimalPlaces, BigNumber.ROUND_UP)
        : money.toString();
    } else {
      return value;
    }
  };

  formatForDisplay = (currency: ECurrency, value?: string) =>
    value !== undefined && value !== ""
      ? formatThousands(this.formatMoney(value, currency === ECurrency.EUR_TOKEN ? 2 : 4))
      : "";

  state = {
    value: this.props.value
      ? this.formatForDisplay(
          this.props.currency,
          this.moneyToPrimaryBase(this.props.value, MONEY_DECIMALS),
        )
      : "",
  };

  formatOnChange = (value: string, stateValue: string | undefined, decimalPlaces: number) => {
    const strippedValue = stripNumberFormatting(value);
    const decimals = strippedValue.split(".")[1];

    if (decimals !== undefined && decimals.length > decimalPlaces) {
      /*ignore last character if we already have max decimal places, otherwise round value*/
      return stateValue && strippedValue.startsWith(stateValue)
        ? stateValue
        : this.formatMoney(strippedValue, decimalPlaces);
    } else {
      return strippedValue;
    }
  };

  changeValue = (value: string) => {
    const validValue: string | null = parseInputToNumber(value);

    if (validValue !== null) {
      const newValue = this.formatOnChange(
        validValue,
        this.state.value,
        this.props.currency === ECurrency.ETH ? 4 : 2,
      );
      if (newValue !== this.state.value) {
        this.setState({ value: newValue });
        this.props.dispatchFn(newValue);
        this.props.setError(false);
      }
    } else if (value !== this.state.value) {
      this.setState({ value });
      this.props.dispatchFn("");
      this.props.setError(true);
    }
  };

  onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.changeValue(e.clipboardData.getData("text"));
  };

  onBlur = (value?: string) => {
    if (isValidNumberOrEmpty(value)) {
      this.setState({ value: this.formatForDisplay(this.props.currency, value) });
    }
  };

  onFocus = (value?: string) => {
    if (isValidNumberOrEmpty(value)) {
      this.setState({ value: value && stripNumberFormatting(value) });
    } else {
      this.setState({ value });
    }
  };

  hasFocus = (id: string) => !!document.activeElement && document.activeElement.id === id;

  componentDidUpdate(): void {
    const propsValue = this.props.value
      ? this.formatForDisplay(
          this.props.currency,
          this.moneyToPrimaryBase(this.props.value, MONEY_DECIMALS),
        )
      : "";
    const stateValue = this.state.value;
    if (!this.hasFocus(this.props.name) && propsValue !== stateValue) {
      this.setState({ value: propsValue });
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
