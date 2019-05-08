import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FormatShortNumber, FormatShortNumberRange } from "./FormatShortNumber";
import { EHumanReadableFormat } from "./utils";

storiesOf("FormatShortNumber", module)
  .add("one million", () => <FormatShortNumber value={1000000} />)
  .add("one million short", () => (
    <FormatShortNumber value={1000000} outputFormat={EHumanReadableFormat.SHORT} />
  ))
  .add("2 millions", () => <FormatShortNumber value={2000000} />)
  .add("2 millions short", () => (
    <FormatShortNumber value={2000000} outputFormat={EHumanReadableFormat.SHORT} />
  ))
  .add("5.5 millions", () => <FormatShortNumber value={5500000} />)
  .add("5.5 millions short", () => (
    <FormatShortNumber value={5500000} outputFormat={EHumanReadableFormat.SHORT} />
  ))
  .add("25 millions", () => <FormatShortNumber value={25000000} />)
  .add("one thousand", () => <FormatShortNumber value={1000} />)
  .add("one thousand short", () => (
    <FormatShortNumber value={1000} outputFormat={EHumanReadableFormat.SHORT} />
  ))
  .add("2 thousands", () => <FormatShortNumber value={2000} />)
  .add("9.9 thousands", () => <FormatShortNumber value={9900} />)
  .add("125 thousands", () => <FormatShortNumber value={125000} />)
  .add("125 thousands short", () => (
    <FormatShortNumber value={125000} outputFormat={EHumanReadableFormat.SHORT} />
  ))
  .add("1", () => <FormatShortNumber value={1} />)
  .add("999", () => <FormatShortNumber value={999} />)
  .add("1.5 - 10 millions", () => (
    <FormatShortNumberRange valueFrom={1500000} valueUpto={10000000} />
  ))
  .add("1.5 - 10 millions short", () => (
    <FormatShortNumberRange
      valueFrom={1500000}
      valueUpto={10000000}
      outputFormat={EHumanReadableFormat.SHORT}
    />
  ))
  .add("120 - 1000 thousands", () => (
    <FormatShortNumberRange valueFrom={120000} valueUpto={1000000} />
  ))
  .add("120 - 1000 thousands short", () => (
    <FormatShortNumberRange
      valueFrom={120000}
      valueUpto={1000000}
      outputFormat={EHumanReadableFormat.SHORT}
    />
  ))
  .add("500 - 20000", () => <FormatShortNumberRange valueFrom={500} valueUpto={20000} />)
  .add("500 - 20000 short", () => (
    <FormatShortNumberRange
      valueFrom={500}
      valueUpto={20000}
      outputFormat={EHumanReadableFormat.SHORT}
    />
  ));
