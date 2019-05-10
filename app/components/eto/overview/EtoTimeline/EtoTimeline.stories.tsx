import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EETOStateOnChain } from "../../../../modules/eto/types";
import { withMockedDate } from "../../../../utils/storybookHelpers.unsafe";
import { EtoTimeline } from "./EtoTimeline";

const startOfStates = {
  [EETOStateOnChain.Setup]: undefined,
  [EETOStateOnChain.Whitelist]: new Date(2018, 0, 1),
  [EETOStateOnChain.Public]: new Date(2018, 1, 10),
  [EETOStateOnChain.Signing]: new Date(2018, 1, 28),
  [EETOStateOnChain.Claim]: new Date(2018, 2, 20),
  [EETOStateOnChain.Payout]: new Date(2018, 3, 20),
  [EETOStateOnChain.Refund]: new Date(2018, 1, 28),
};

storiesOf("ETO/EtoTimeline", module)
  .add("whitelisting", () =>
    withMockedDate(new Date(2017, 11, 20))(() => (
      <EtoTimeline startOfStates={undefined} currentState={undefined} />
    )),
  )
  .add("presale", () =>
    withMockedDate(new Date(2018, 0, 5))(() => (
      <EtoTimeline startOfStates={startOfStates} currentState={EETOStateOnChain.Whitelist} />
    )),
  )
  .add("public sale", () =>
    withMockedDate(new Date(2018, 1, 10))(() => (
      <EtoTimeline startOfStates={startOfStates} currentState={EETOStateOnChain.Public} />
    )),
  )
  .add("signing", () =>
    withMockedDate(new Date(2018, 2, 5))(() => (
      <EtoTimeline startOfStates={startOfStates} currentState={EETOStateOnChain.Signing} />
    )),
  )
  .add("claim", () =>
    withMockedDate(new Date(2018, 2, 25))(() => (
      <EtoTimeline startOfStates={startOfStates} currentState={EETOStateOnChain.Claim} />
    )),
  )
  .add("payout", () =>
    withMockedDate(new Date(2018, 3, 22))(() => (
      <EtoTimeline startOfStates={startOfStates} currentState={EETOStateOnChain.Payout} />
    )),
  )
  .add("refund", () =>
    withMockedDate(new Date(2018, 2, 5))(() => (
      <EtoTimeline startOfStates={startOfStates} currentState={EETOStateOnChain.Refund} />
    )),
  );
