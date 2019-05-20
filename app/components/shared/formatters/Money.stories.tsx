import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrencySymbol, EMoneyTransfer, ETheme, MoneyNew } from "./Money";
import { MoneyRange } from "./MoneyRange";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "./utils";

const value = "1234567" + "0".repeat(18);
const value1 = "321" + "0".repeat(18);

storiesOf("MoneyNew", module)
  .add("default (with token code)", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={value}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.NEU}
        value={value}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR_TOKEN}
        value={value}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.ETH}
        value={value}
      />
    </>
  ))
  .add("with FLOAT input", () => (
    <>
      <MoneyNew
        outputFormat={ENumberOutputFormat.FULL}
        inputFormat={ENumberInputFormat.FLOAT}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as Integer", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.INTEGER}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as LONG abbrev.", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as SHORT abbrev.", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("with default value", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={undefined}
      />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={undefined}
        defaultValue={"-- nothing here :) --"}
      />
    </>
  ))
  .add("transfer", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={value}
        transfer={EMoneyTransfer.INCOME}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={value}
        transfer={EMoneyTransfer.OUTCOME}
      />
    </>
  ))
  .add("with token code", () => (
    <MoneyNew
      inputFormat={ENumberInputFormat.ULPS}
      outputFormat={ENumberOutputFormat.FULL}
      moneyFormat={ECurrency.EUR}
      value={value}
      currencySymbol={ECurrencySymbol.CODE}
    />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={value}
        theme={ETheme.GREEN}
      />
      <br />
      <br />
      <p>t-orange</p>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.ETH}
        value={value}
        theme={ETheme.ORANGE}
      />
      <br />
      <br />
      <p>big-value</p>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.ETH}
        value={value}
        theme={ETheme.GREEN_BIG}
      />
    </>
  ))
  .add("price format", () => (
    <>
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.CODE}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.NONE}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.ETH}
        value={"4212376189" + "0".repeat(10)}
      />
      <br />
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.NEU}
        value={"353212376189" + "0".repeat(10)}
      />
    </>
  ));

storiesOf("MoneyRange", module)
  .add("default (with token code)", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
      />
      <br />
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.NEU}
        valueFrom={value1}
        valueUpto={value}
      />
      <br />
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR_TOKEN}
        valueFrom={value1}
        valueUpto={value}
      />
      <br />
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.ETH}
        valueFrom={value1}
        valueUpto={value}
      />
    </>
  ))
  .add("with custom separator", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
        separator=" :: "
      />
    </>
  ))
  .add("with default value", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        valueFrom={undefined}
        valueUpto={undefined}
      />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        valueFrom={undefined}
        valueUpto={undefined}
        defaultValue={"***"}
      />
    </>
  ))
  .add("with FLOAT input", () => (
    <>
      <MoneyRange
        outputFormat={ENumberOutputFormat.FULL}
        inputFormat={ENumberInputFormat.FLOAT}
        moneyFormat={ECurrency.EUR}
        valueFrom={"222"}
        valueUpto={"1236525"}
        separator=" :: "
      />
    </>
  ))
  .add("with SHORT output form", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
        moneyFormat={ECurrency.EUR}
        valueFrom={"12365"}
        valueUpto={"10236525"}
      />
    </>
  ))
  .add("with LONG output form", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        moneyFormat={ECurrency.EUR}
        valueFrom={"123525"}
        valueUpto={"102365325"}
      />
    </>
  ))
  .add("with INTEGER output form", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.INTEGER}
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
      />
    </>
  ))
  .add("with ONLY_NONZERO_DECIMALS output form", () => (
    <>
      <MoneyRange
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
        moneyFormat={ECurrency.EUR}
        valueFrom={"123525.000"}
        valueUpto={"22123525.000"}
      />
    </>
  ));
