import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { convertToBigInt } from "../../../../utils/Number.utils";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { WithdrawLayout } from "./Withdraw.unsafe";

storiesOf("WithdrawUnsafe", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <WithdrawLayout
      ethAmount={convertToBigInt(124124)}
      ethEuroAmount={convertToBigInt(124124)}
      gasPrice={convertToBigInt(0.002)}
      gasPriceEur={convertToBigInt(0.2)}
      total={convertToBigInt(124124.002)}
      totalEur={convertToBigInt(124124.2)}
      walletAddress="0x327t3278gf27c82bsimfoc2"
      onAccept={() => action("onAccept")}
      additionalData={{}}
      maxEther={"100000000000000000000000000000"}
      onValidateHandler={() => {}}
      onBack={() => action("onBack")}
    />
  ));
