import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrencySymbol, EMoneyTransfer, ETheme, MoneyNew } from "./Money";
import { MoneyRange } from "./MoneyRange";
import { ECurrency, EHumanReadableFormat, EMoneyInputFormat } from "./utils";

const value = "1234567" + "0".repeat(18);
const value1 = "321" + "0".repeat(18);

storiesOf("MoneyNew", module)
  .add("default (with token code)", () => (
    <>
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.NEU}
        value={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.EUR_TOKEN}
        value={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.ETH}
        value={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
    </>
  ))
  .add("with FLOAT input", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.FLOAT}
        outputFormat={EHumanReadableFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as Integer", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.FLOAT}
        outputFormat={EHumanReadableFormat.INTEGER}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as LONG abbrev.", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.FLOAT}
        outputFormat={EHumanReadableFormat.LONG}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as SHORT abbrev.", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.FLOAT}
        outputFormat={EHumanReadableFormat.SHORT}
        moneyFormat={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("with default value", () => (
    <>
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={undefined}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.ULPS}
        moneyFormat={ECurrency.EUR}
        outputFormat={EHumanReadableFormat.FULL}
        value={undefined}
        defaultValue={"-- nothing here :) --"}
      />
    </>
  ))
  .add("transfer", () => (
    <>
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={value}
        transfer={EMoneyTransfer.INCOME}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={value}
        transfer={EMoneyTransfer.OUTCOME}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
    </>
  ))
  .add("no token symbol", () => (
    <MoneyNew
      moneyFormat={ECurrency.EUR}
      value={value}
      currencySymbol={ECurrencySymbol.NONE}
      inputFormat={EMoneyInputFormat.ULPS}
      outputFormat={EHumanReadableFormat.FULL}
    />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={value}
        theme={ETheme.GREEN}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <br />
      <p>t-orange</p>
      <MoneyNew
        moneyFormat={ECurrency.ETH}
        value={value}
        theme={ETheme.ORANGE}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <br />
      <p>big-value</p>
      <MoneyNew
        moneyFormat={ECurrency.ETH}
        value={value}
        theme={ETheme.GREEN_BIG}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
    </>
  ))
  .add("price format", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.ULPS}
        moneyFormat={ECurrency.EUR}
        outputFormat={EHumanReadableFormat.FULL}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.CODE}
      />
      <br />
      <MoneyNew
        inputFormat={EMoneyInputFormat.ULPS}
        moneyFormat={ECurrency.EUR}
        outputFormat={EHumanReadableFormat.FULL}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.NONE}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.ETH}
        value={"4212376189" + "0".repeat(10)}
        outputFormat={EHumanReadableFormat.FULL}
        inputFormat={EMoneyInputFormat.ULPS}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.NEU}
        value={"353212376189" + "0".repeat(10)}
        outputFormat={EHumanReadableFormat.FULL}
        inputFormat={EMoneyInputFormat.ULPS}
      />
    </>
  ));

storiesOf("MoneyRange", module)
  .add("default (with token code)", () => (
    <>
      <MoneyRange
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyRange
        moneyFormat={ECurrency.NEU}
        valueFrom={value1}
        valueUpto={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyRange
        moneyFormat={ECurrency.EUR_TOKEN}
        valueFrom={value1}
        valueUpto={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
      <br />
      <MoneyRange
        moneyFormat={ECurrency.ETH}
        valueFrom={value1}
        valueUpto={value}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
    </>
  ))
  .add("with custom separator", () => (
    <>
      <MoneyRange
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
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
        moneyFormat={ECurrency.EUR}
        valueFrom={undefined}
        valueUpto={undefined}
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.FULL}
      />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <MoneyRange
        inputFormat={EMoneyInputFormat.ULPS}
        moneyFormat={ECurrency.EUR}
        outputFormat={EHumanReadableFormat.FULL}
        valueFrom={undefined}
        valueUpto={undefined}
        defaultValue={"***"}
      />
    </>
  ))
  .add("with FLOAT input", () => (
    <>
      <MoneyRange
        inputFormat={EMoneyInputFormat.FLOAT}
        moneyFormat={ECurrency.EUR}
        outputFormat={EHumanReadableFormat.FULL}
        valueFrom={"222"}
        valueUpto={"1236525"}
        separator=" :: "
      />
    </>
  ))
  .add("with SHORT output form", () => (
    <>
      <MoneyRange
        inputFormat={EMoneyInputFormat.FLOAT}
        outputFormat={EHumanReadableFormat.SHORT}
        moneyFormat={ECurrency.EUR}
        valueFrom={"12365"}
        valueUpto={"10236525"}
      />
    </>
  ))
  .add("with LONG output form", () => (
    <>
      <MoneyRange
        inputFormat={EMoneyInputFormat.FLOAT}
        outputFormat={EHumanReadableFormat.LONG}
        moneyFormat={ECurrency.EUR}
        valueFrom={"123525"}
        valueUpto={"102365325"}
      />
    </>
  ))
  .add("with INTEGER output form", () => (
    <>
      <MoneyRange
        inputFormat={EMoneyInputFormat.ULPS}
        outputFormat={EHumanReadableFormat.INTEGER}
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
      />
    </>
  ));
