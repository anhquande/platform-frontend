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
      <MoneyNew moneyFormat={ECurrency.EUR} value={value} />
      <br />
      <MoneyNew moneyFormat={ECurrency.NEU} value={value} />
      <br />
      <MoneyNew moneyFormat={ECurrency.EUR_TOKEN} value={value} />
      <br />
      <MoneyNew moneyFormat={ECurrency.ETH} value={value} />
    </>
  ))
  .add("with FLOAT input", () => (
    <>
      <MoneyNew
        inputFormat={EMoneyInputFormat.FLOAT}
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
      <MoneyNew moneyFormat={ECurrency.EUR} value={undefined} />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={undefined}
        defaultValue={"-- nothing here :) --"}
      />
    </>
  ))
  .add("transfer", () => (
    <>
      <MoneyNew moneyFormat={ECurrency.EUR} value={value} transfer={EMoneyTransfer.INCOME} />
      <br />
      <MoneyNew moneyFormat={ECurrency.EUR} value={value} transfer={EMoneyTransfer.OUTCOME} />
    </>
  ))
  .add("no token symbol", () => (
    <MoneyNew moneyFormat={ECurrency.EUR} value={value} currencySymbol={ECurrencySymbol.NONE} />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <MoneyNew moneyFormat={ECurrency.EUR} value={value} theme={ETheme.GREEN} />
      <br />
      <br />
      <p>t-orange</p>
      <MoneyNew moneyFormat={ECurrency.ETH} value={value} theme={ETheme.ORANGE} />
      <br />
      <br />
      <p>big-value</p>
      <MoneyNew moneyFormat={ECurrency.ETH} value={value} theme={ETheme.GREEN_BIG} />
    </>
  ))
  .add("price format", () => (
    <>
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.CODE}
      />
      <br />
      <MoneyNew
        moneyFormat={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.NONE}
      />
      <br />
      <MoneyNew moneyFormat={ECurrency.ETH} value={"4212376189" + "0".repeat(10)} />
      <br />
      <MoneyNew moneyFormat={ECurrency.NEU} value={"353212376189" + "0".repeat(10)} />
    </>
  ));

storiesOf("MoneyRange", module)
  .add("default (with token code)", () => (
    <>
      <MoneyRange moneyFormat={ECurrency.EUR} valueFrom={value1} valueUpto={value} />
      <br />
      <MoneyRange moneyFormat={ECurrency.NEU} valueFrom={value1} valueUpto={value} />
      <br />
      <MoneyRange moneyFormat={ECurrency.EUR_TOKEN} valueFrom={value1} valueUpto={value} />
      <br />
      <MoneyRange moneyFormat={ECurrency.ETH} valueFrom={value1} valueUpto={value} />
    </>
  ))
  .add("with custom separator", () => (
    <>
      <MoneyRange
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
        separator=" :: "
      />
    </>
  ))
  .add("with default value", () => (
    <>
      <MoneyRange moneyFormat={ECurrency.EUR} valueFrom={undefined} valueUpto={undefined} />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <MoneyRange
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
        inputFormat={EMoneyInputFormat.FLOAT}
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
        outputFormat={EHumanReadableFormat.INTEGER}
        moneyFormat={ECurrency.EUR}
        valueFrom={value1}
        valueUpto={value}
      />
    </>
  ));
