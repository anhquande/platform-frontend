import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { wrapWithIntl } from "../../../../test/integrationTestUtils.unsafe";
import { FormatShortNumber } from "./FormatShortNumber";
import { EAbbreviatedNumberOutputFormat, ENumberInputFormat } from "./utils";

describe("FormatShortNumber component", () => {
  it("should render number in LONG abbreviated form", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumber
          value={"123"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("123");
  });
  it("should render number in LONG abbreviated form - thousands", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumber
          value={"12345"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("12.3 thousand");
  });
  it("should render number in LONG abbreviated form - millions", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumber
          value={"12345678"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("12.3 million");
  });
});
