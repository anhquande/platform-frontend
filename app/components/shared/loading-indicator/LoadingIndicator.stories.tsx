import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ELoadingIndicator, LoadingIndicator } from "./LoadingIndicator";

storiesOf("LoadingIndicator", module)
  .add("pulse (default)", () => <LoadingIndicator />)
  .add("blocks", () => <LoadingIndicator type={ELoadingIndicator.BLOCKS} />)
  .add("hexagon", () => <LoadingIndicator type={ELoadingIndicator.HEXAGON} />)
  .add("spinner", () => <LoadingIndicator type={ELoadingIndicator.SPINNER} />);
