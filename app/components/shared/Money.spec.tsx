import BigNumber from "bignumber.js";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { ECurrency, ENumberInputFormat, ERoundingMode } from "./formatters/utils";
import { ECurrencySymbol, getFormattedMoney, Money } from "./Money.unsafe";

describe("Money", () => {
  describe("Money component", () => {
    it("should format money from wei", () => {
      const component = shallow(
        <Money value={"1234567" + "0".repeat(16)} currency={ECurrency.ETH} />,
      );

      expect(component.render().text()).to.be.eq("12 345.6700 ETH");
    });

    it("should format money when format is set to FLOAT", () => {
      const component = shallow(
        <Money value={"2501234"} currency={ECurrency.EUR} format={ENumberInputFormat.FLOAT} />,
      );

      expect(component.render().text()).to.be.eq("2 501 234 EUR");
    });

    it("should use token symbol for eur", () => {
      const component = shallow(
        <Money
          value={"123456" + "0".repeat(16)}
          currency={ECurrency.EUR}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />,
      );

      expect(component.render().text()).to.be.eq("€1 234.56");
    });

    it("should not add either token symbol or code  ", () => {
      const component = shallow(
        <Money
          value={"123456" + "0".repeat(16)}
          currency={ECurrency.EUR}
          currencySymbol={ECurrencySymbol.NONE}
        />,
      );

      expect(component.render().text()).to.be.eq("1 234.56");
    });

    it("should output - when no value is provided", () => {
      const component = shallow(<Money currency={ECurrency.EUR} />);
      expect(component.text()).to.be.eq("-");
    });

    it("should not add thousands separator if value is React.element type", () => {
      const value = <React.Fragment>1234567</React.Fragment>;
      const component = shallow(
        <Money value={value} currency={ECurrency.EUR} currencySymbol={ECurrencySymbol.NONE} />,
      );

      expect(component.render().text()).to.be.eq("1234567");
    });

    it("should format eur_token token", () => {
      const component = shallow(
        <Money value={"123456" + "0".repeat(16)} currency={ECurrency.EUR_TOKEN} />,
      );

      expect(component.render().text()).to.be.eq("1 234.56 nEUR");
    });

    it("should throw error for non existing token symbol", () => {
      const componentMount = () =>
        shallow(
          <Money
            value={"123456" + "0".repeat(16)}
            currency={ECurrency.EUR_TOKEN}
            currencySymbol={ECurrencySymbol.SYMBOL}
          />,
        );

      expect(componentMount).to.throw("Only EUR can be displayed as a symbol");
    });

    it("should format value with 8 decimal places from wei", () => {
      const component = shallow(
        <Money
          value={"32376189" + "0".repeat(10)}
          currency={ECurrency.EUR}
          currencySymbol={ECurrencySymbol.SYMBOL}
          isPrice={true}
        />,
      );

      expect(component.render().text()).to.be.eq("€0.32376189");
    });

    it("should format value with 8 decimal places from float", () => {
      const component = shallow(
        <Money
          value={"0.166250351468706841"}
          format={ENumberInputFormat.FLOAT}
          currency={ECurrency.EUR}
          currencySymbol={ECurrencySymbol.SYMBOL}
          isPrice={true}
        />,
      );

      expect(component.render().text()).to.be.eq("€0.16625036");
    });
  });

  describe("getFormattedMoney", () => {
    it("should format ULPS values", () => {
      // By default rounded up
      expect(getFormattedMoney("1242.21621e+18", ECurrency.ETH, ENumberInputFormat.ULPS)).to.eq(
        "1242.2163",
      );
      expect(getFormattedMoney(346342.235e18, ECurrency.EUR, ENumberInputFormat.ULPS)).to.eq(
        "346342.24",
      );
      expect(
        getFormattedMoney(
          new BigNumber(346342.235e18),
          ECurrency.EUR_TOKEN,
          ENumberInputFormat.ULPS,
        ),
      ).to.eq("346342.24");
    });

    it("should format float values", () => {
      // By default rounded up
      expect(getFormattedMoney("1242.21621", ECurrency.ETH, ENumberInputFormat.FLOAT)).to.eq(
        "1242.2163",
      );
      expect(getFormattedMoney(346342.235, ECurrency.EUR, ENumberInputFormat.FLOAT)).to.eq(
        "346342.24",
      );
      expect(
        getFormattedMoney(new BigNumber(346342.235), ECurrency.EUR_TOKEN, ENumberInputFormat.FLOAT),
      ).to.eq("346342.24");
    });

    it("should format float values", () => {
      // By default rounded up
      expect(getFormattedMoney("1242.21621", ECurrency.ETH, ENumberInputFormat.FLOAT)).to.eq(
        "1242.2163",
      );
      expect(getFormattedMoney(346342.235, ECurrency.EUR, ENumberInputFormat.FLOAT)).to.eq(
        "346342.24",
      );
      expect(
        getFormattedMoney(new BigNumber(346342.235), ECurrency.EUR_TOKEN, ENumberInputFormat.FLOAT),
      ).to.eq("346342.24");
    });

    it("should format to 8 decimal places if value is price", () => {
      // By default rounded up
      expect(
        getFormattedMoney("1242.21621134341", ECurrency.ETH, ENumberInputFormat.FLOAT, true),
      ).to.eq("1242.21621135");
      expect(
        getFormattedMoney(346342.235412415, ECurrency.EUR, ENumberInputFormat.FLOAT, true),
      ).to.eq("346342.23541242");
      expect(
        getFormattedMoney(
          new BigNumber(3.2351251122e18),
          ECurrency.EUR_TOKEN,
          ENumberInputFormat.ULPS,
          true,
        ),
      ).to.eq("3.23512512");
    });

    it("should round down values", () => {
      expect(
        getFormattedMoney(
          "1242.21621134341",
          ECurrency.ETH,
          ENumberInputFormat.FLOAT,
          false,
          ERoundingMode.DOWN,
        ),
      ).to.eq("1242.2162");
      expect(
        getFormattedMoney(
          346342.235412415,
          ECurrency.EUR,
          ENumberInputFormat.FLOAT,
          false,
          ERoundingMode.DOWN,
        ),
      ).to.eq("346342.23");
      expect(
        getFormattedMoney(
          new BigNumber(3.2351251122e18),
          ECurrency.EUR_TOKEN,
          ENumberInputFormat.ULPS,
          false,
          ERoundingMode.DOWN,
        ),
      ).to.eq("3.23");
    });
  });
});
