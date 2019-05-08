import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { WithdrawSummaryComponent } from "./Summary";

const props = {
  txHash: "0xdb3c43a0cfc4e221ecb52655eab3c3b88ba521a",
  additionalData: {
    value: "5500000000000000000",
    walletAddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    amount: "5500000000000000000",
    amountEur: "5500000000000000000",
    cost: "313131232312331212",
    costEur: "313131232312331212",
    total: "313131232312331212",
    totalEur: "313131232312331212",
  },
  onAccept: action("onAccept"),
  onChange: action("onChange"),
};

storiesOf("WithdrawUnsafe summary", module)
  .addDecorator(withModalBody())
  .add("default", () => <WithdrawSummaryComponent {...props} />);
