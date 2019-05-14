import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { ECurrencySymbol, MoneyNew } from "./Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "./utils";

describe("MoneyNew", () => {
  it("should format money from wei", () => {
    const component = shallow(
      <MoneyNew
        value={"1234567" + "0".repeat(16)}
        moneyFormat={ECurrency.ETH}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("12 345.6700 ETH");
  });

  it("should return money without decimal part when human readable format is set to INTEGER", () => {
    const component = shallow(
      <MoneyNew
        value={"2501234.1"}
        moneyFormat={ECurrency.EUR}
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.INTEGER}
      />,
    );

    expect(component.render().text()).to.be.eq("2 501 234 EUR");
  });

  it("should return money without zero decimal part when human readable format is set to ONLY_NONZERO_DECIMALS", () => {
    const component1 = shallow(
      <MoneyNew
        value={"2501234.19"}
        moneyFormat={ECurrency.EUR}
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
      />,
    );
    const component2 = shallow(
      <MoneyNew
        value={"2501234.00000"}
        moneyFormat={ECurrency.EUR}
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
      />,
    );

    expect(component1.render().text()).to.be.eq("2 501 234.19 EUR");
    expect(component2.render().text()).to.be.eq("2 501 234 EUR");
  });
  it("should not add either token symbol or code  ", () => {
    const component = shallow(
      <MoneyNew
        value={"123456" + "0".repeat(16)}
        inputFormat={ENumberInputFormat.ULPS}
        moneyFormat={ECurrency.EUR}
        outputFormat={ENumberOutputFormat.FULL}
        currencySymbol={ECurrencySymbol.NONE}
      />,
    );
    expect(component.render().text()).to.be.eq("1 234.56");
  });
  it("should output '-' when no value is provided", () => {
    const component = shallow(
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={undefined}
      />,
    );

    expect(component.text()).to.be.eq("-");
  });
  it("should output custom placeholder value when no value is provided", () => {
    const component = shallow(
      <MoneyNew
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        value={undefined}
        defaultValue={"nothing here :))"}
      />,
    );

    expect(component.text()).to.be.eq("nothing here :))");
  });

  it("should format eur_token token", () => {
    const component = shallow(
      <MoneyNew
        value={"123456" + "0".repeat(16)}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR_TOKEN}
      />,
    );

    expect(component.render().text()).to.be.eq("1 234.56 nEUR");
  });
});
