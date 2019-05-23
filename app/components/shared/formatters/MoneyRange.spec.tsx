import { expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { wrapWithIntl } from "../../../../test/integrationTestUtils.unsafe";
import { MoneyRange } from "./MoneyRange";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "./utils";

describe("MoneyRange", () => {
  it("renders money range", () => {
    const component = shallow(
      <MoneyRange
        valueFrom={"323" + "0".repeat(16)}
        valueUpto={"32376189" + "0".repeat(16)}
        moneyFormat={ECurrency.EUR}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("3.23–323 761.89 EUR");
  });
  it("renders money range with placeholder", () => {
    const component = shallow(
      <MoneyRange
        valueFrom={undefined}
        valueUpto={undefined}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
      />,
    );

    expect(component.render().text()).to.be.eq("-");
  });
  it("renders money range with custom placeholder", () => {
    const component = shallow(
      <MoneyRange
        valueFrom={undefined}
        valueUpto={undefined}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
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
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        moneyFormat={ECurrency.EUR}
        separator=" :: "
      />,
    );

    expect(component.render().text()).to.be.eq("3.23 :: 323 761.89 EUR");
  });
  it("renders money range with FLOAT input", () => {
    const component = shallow(
      <MoneyRange
        outputFormat={ENumberOutputFormat.FULL}
        inputFormat={ENumberInputFormat.FLOAT}
        moneyFormat={ECurrency.EUR}
        valueFrom={"222"}
        valueUpto={"1236525"}
      />,
    );

    expect(component.render().text()).to.be.eq("222.00–1 236 525.00 EUR");
  });
  it("renders money range as INTEGER output", () => {
    const component = shallow(
      <MoneyRange
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.INTEGER}
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
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
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
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
          moneyFormat={ECurrency.EUR}
          valueFrom={"22222"}
          valueUpto={"1236525"}
        />,
      ),
    );

    expect(component.render().text()).to.be.eq("22.2 thousand – 1.2 million EUR");
  });
  it("renders custom placeholder", () => {
    const component = mount(
      wrapWithIntl(
        <MoneyRange
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
          moneyFormat={ECurrency.EUR}
          valueFrom={"22222"}
          valueUpto={undefined}
          defaultValue={"nothing here :("}
        />,
      ),
    );

    expect(component.render().text()).to.be.eq("nothing here :(");
  });
});
