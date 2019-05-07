import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrency, EMoneyInputFormat } from "./formatters/utils";
import { ECurrencySymbol, EMoneyTransfer, ETheme, Money } from "./Money.unsafe";

const value = "1234567" + "0".repeat(18);

storiesOf("Money", module)
  .add("default (with token code)", () => (
    <>
      <Money currency={ECurrency.EUR} value={value} />
      <br />
      <Money currency={ECurrency.NEU} value={value} />
      <br />
      <Money currency={ECurrency.EUR_TOKEN} value={value} />
      <br />
      <Money currency={ECurrency.ETH} value={value} />
    </>
  ))
  .add("with token symbol", () => (
    <>
      <Money currency={ECurrency.EUR} value={value} currencySymbol={ECurrencySymbol.SYMBOL} />
      <br />
      <Money
        value={100}
        currency={ECurrency.EUR}
        format={EMoneyInputFormat.FLOAT}
        currencySymbol={ECurrencySymbol.SYMBOL}
      />
    </>
  ))
  .add("transfer", () => (
    <>
      <Money currency={ECurrency.EUR} value={value} transfer={EMoneyTransfer.INCOME} />
      <br />
      <Money currency={ECurrency.EUR} value={value} transfer={EMoneyTransfer.OUTCOME} />
    </>
  ))
  .add("no token symbol", () => (
    <Money currency={ECurrency.EUR} value={value} currencySymbol={ECurrencySymbol.NONE} />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <Money currency={ECurrency.EUR} value={value} theme={ETheme.GREEN} />
      <br />
      <br />
      <p>t-orange</p>
      <Money currency={ECurrency.ETH} value={value} theme={ETheme.ORANGE} />
      <br />
      <br />
      <p>big-value</p>
      <Money currency={ECurrency.ETH} value={value} theme={ETheme.GREEN_BIG} />
    </>
  ))
  .add("price format", () => (
    <>
      <Money
        currency={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.SYMBOL}
        isPrice={true}
      />
      <br />
      <Money
        currency={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.NONE}
        isPrice={true}
      />
      <br />
      <Money
        currency={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.CODE}
        isPrice={true}
      />
      <br />
      <Money currency={ECurrency.ETH} value={"4212376189" + "0".repeat(10)} isPrice={true} />
      <br />
      <Money currency={ECurrency.NEU} value={"353212376189" + "0".repeat(10)} isPrice={true} />
    </>
  ));
