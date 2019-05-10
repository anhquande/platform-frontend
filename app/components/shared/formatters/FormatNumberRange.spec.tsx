import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { wrapWithIntl } from "../../../../test/integrationTestUtils.unsafe";
import { FormatShortNumberRange } from "./FormatShortNumber";
import { EAbbreviatedNumberOutputFormat, ENumberInputFormat } from "./utils";

describe("FormatShortNumberRange component", () => {
  it("should render numbers in LONG abbreviated form", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumberRange
          valueFrom={"123"}
          valueUpto={"123426"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("123 — 123.4 thousand");
  });
  it("should render numbers in LONG abbreviated form", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumberRange
          valueFrom={"123456"}
          valueUpto={"3234260"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("123.4 thousand — 3.2 million");
  });

  it("should render numbers in SHORT abbreviated form", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumberRange
          valueFrom={"123"}
          valueUpto={"123426"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("123—123.4k");
  });
  it("should render numbers in SHORT abbreviated form", () => {
    const component = mount(
      wrapWithIntl(
        <FormatShortNumberRange
          valueFrom={"123456"}
          valueUpto={"3234260"}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
        />,
      ),
    );
    expect(component.render().text()).to.be.eq("123.4k—3.2M");
  });
});
