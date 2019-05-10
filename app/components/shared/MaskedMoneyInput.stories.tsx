import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrency } from "./formatters/utils";
import { MaskedMoneyInput } from "./MaskedMoneyInput";

const defaultProps = {
  name: "ethInput",
  value: "1234567" + "0".repeat(16),
  dispatchFn: action("setValue"),
  placeholder: "money input placeholder",
  "data-test-id": "dataTestID",
  setError: action("error"),
};

storiesOf("MaskedMoneyInput", module)
  .add("shows Eth (4 decimal places)", () => (
    <MaskedMoneyInput {...defaultProps} currency={ECurrency.ETH} />
  ))
  .add("shows EuroToken (2 decimal places)", () => (
    <MaskedMoneyInput {...defaultProps} currency={ECurrency.EUR_TOKEN} />
  ));
