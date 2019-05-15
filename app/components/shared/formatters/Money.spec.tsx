import { expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { wrapWithIntl } from "../../../../test/integrationTestUtils.unsafe";
import { ECurrencySymbol, MoneyNew } from "./Money";
import { MoneyRange } from "./MoneyRange";
import { ECurrency, EHumanReadableFormat, EMoneyInputFormat } from "./utils";

describe("MoneyNew", () => {
  describe("MoneyNew component", () => {
    it("should format money from wei", () => {
      const component = shallow(
        <MoneyNew
          value={"1234567" + "0".repeat(16)}
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.ETH}
          outputFormat={EHumanReadableFormat.FULL}
        />,
      );

      expect(component.render().text()).to.be.eq("12 345.6700 ETH");
    });

    it("should return money without decimal part when human readable format is set to INTEGER", () => {
      const component = shallow(
        <MoneyNew
          value={"2501234.1"}
          moneyFormat={ECurrency.EUR}
          inputFormat={EMoneyInputFormat.FLOAT}
          outputFormat={EHumanReadableFormat.INTEGER}
        />,
      );

      expect(component.render().text()).to.be.eq("2 501 234 EUR");
    });

    it("should return money without zero decimal part when human readable format is set to ONLY_NONZERO_DECIMALS", () => {
      const component1 = shallow(
        <MoneyNew
          value={"2501234.19"}
          moneyFormat={ECurrency.EUR}
          inputFormat={EMoneyInputFormat.FLOAT}
          outputFormat={EHumanReadableFormat.ONLY_NONZERO_DECIMALS}
        />,
      );
      const component2 = shallow(
        <MoneyNew
          value={"2501234.00000"}
          moneyFormat={ECurrency.EUR}
          inputFormat={EMoneyInputFormat.FLOAT}
          outputFormat={EHumanReadableFormat.ONLY_NONZERO_DECIMALS}
        />,
      );

      expect(component1.render().text()).to.be.eq("2 501 234.19 EUR");
      expect(component2.render().text()).to.be.eq("2 501 234 EUR");
    });

    it("should not add either token symbol or code  ", () => {
      const component = shallow(
        <MoneyNew
          value={"123456" + "0".repeat(16)}
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
          currencySymbol={ECurrencySymbol.NONE}
        />,
      );

      expect(component.render().text()).to.be.eq("1 234.56");
    });

    it("should output '-' when no value is provided", () => {
      const component = shallow(
        <MoneyNew
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR}
          value={undefined}
          outputFormat={EHumanReadableFormat.FULL}
        />,
      );

      expect(component.text()).to.be.eq("-");
    });
    it("should output custom placeholder value when no value is provided", () => {
      const component = shallow(
        <MoneyNew
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
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
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR_TOKEN}
          outputFormat={EHumanReadableFormat.FULL}
        />,
      );

      expect(component.render().text()).to.be.eq("1 234.56 nEUR");
    });
  });
  describe("MoneyRange component", () => {
    it("renders money range", () => {
      const component = shallow(
        <MoneyRange
          inputFormat={EMoneyInputFormat.ULPS}
          outputFormat={EHumanReadableFormat.FULL}
          valueFrom={"323" + "0".repeat(16)}
          valueUpto={"32376189" + "0".repeat(16)}
          moneyFormat={ECurrency.EUR}
        />,
      );

      expect(component.render().text()).to.be.eq("3.23–323 761.89 EUR");
    });
    it("renders money range with placeholder", () => {
      const component = shallow(
        <MoneyRange
          valueFrom={undefined}
          valueUpto={undefined}
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
        />,
      );

      expect(component.render().text()).to.be.eq("-");
    });
    it("renders money range with placeholder if one of inputs is not given", () => {
      const component = shallow(
        <MoneyRange
          inputFormat={EMoneyInputFormat.ULPS}
          valueFrom={undefined}
          valueUpto={"23"}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
        />,
      );

      expect(component.render().text()).to.be.eq("-");
    });
    it("renders money range with placeholder if one of inputs is not given", () => {
      const component = shallow(
        <MoneyRange
          inputFormat={EMoneyInputFormat.ULPS}
          valueFrom={"23"}
          valueUpto={undefined}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
        />,
      );

      expect(component.render().text()).to.be.eq("-");
    });
    it("renders money range with custom placeholder", () => {
      const component = shallow(
        <MoneyRange
          valueFrom={undefined}
          valueUpto={undefined}
          outputFormat={EHumanReadableFormat.FULL}
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR}
          defaultValue={"*"}
        />,
      );

      expect(component.render().text()).to.be.eq("*");
    });
    it("renders money range with custom separator", () => {
      const component = shallow(
        <MoneyRange
          valueFrom={"323" + "0".repeat(16)}
          valueUpto={"32376189" + "0".repeat(16)}
          inputFormat={EMoneyInputFormat.ULPS}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
          separator=" :: "
        />,
      );

      expect(component.render().text()).to.be.eq("3.23 :: 323 761.89 EUR");
    });
    it("renders money range with FLOAT input", () => {
      const component = shallow(
        <MoneyRange
          inputFormat={EMoneyInputFormat.FLOAT}
          moneyFormat={ECurrency.EUR}
          outputFormat={EHumanReadableFormat.FULL}
          valueFrom={"222"}
          valueUpto={"1236525"}
        />,
      );

      expect(component.render().text()).to.be.eq("222.00–1 236 525.00 EUR");
    });
    it("renders money range as INTEGER output", () => {
      const component = shallow(
        <MoneyRange
          inputFormat={EMoneyInputFormat.FLOAT}
          outputFormat={EHumanReadableFormat.INTEGER}
          moneyFormat={ECurrency.EUR}
          valueFrom={"222"}
          valueUpto={"1236525"}
        />,
      );

      expect(component.render().text()).to.be.eq("222–1 236 525 EUR");
    });
    it("renders money range with with SHORT output", () => {
      const component = mount(
        wrapWithIntl(
          <MoneyRange
            inputFormat={EMoneyInputFormat.FLOAT}
            outputFormat={EHumanReadableFormat.SHORT}
            moneyFormat={ECurrency.EUR}
            valueFrom={"22222"}
            valueUpto={"1236525"}
          />,
        ),
      );

      expect(component.render().text()).to.be.eq("22.2k–1.2M EUR");
    });
    it("renders money range with with LONG output", () => {
      const component = mount(
        wrapWithIntl(
          <MoneyRange
            inputFormat={EMoneyInputFormat.FLOAT}
            outputFormat={EHumanReadableFormat.LONG}
            moneyFormat={ECurrency.EUR}
            valueFrom={"22222"}
            valueUpto={"1236525"}
          />,
        ),
      );

      expect(component.render().text()).to.be.eq("22.2 thousand–1.2 million EUR");
    });
  });
});
