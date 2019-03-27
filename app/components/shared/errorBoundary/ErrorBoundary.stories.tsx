import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../lib/api/users/interfaces";
import { withStore } from "../../../utils/storeDecorator.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "./ErrorBoundaryLayoutAuthorized";
import { ErrorBoundaryLayoutBase } from "./ErrorBoundaryLayoutBase";
import { ErrorBoundaryLayoutUnauthorized } from "./ErrorBoundaryLayoutUnauthorized";
import { ErrorBoundaryPanel } from "./ErrorBoundaryPanel";

const testStore = {
  auth: {
    user: {
      type: EUserType.ISSUER,
    },
  },
  web3: {
    wallet: {
      address: "0x007ff055641147d0a170a7a73b00f0eeb2f07f12",
    },
    previousConnectedWallet: {
      address: "0x007ff055641147d0a170a7a73b00f0eeb2f07f12",
    },
  },
};

storiesOf("ErrorBoundary", module)
  .addDecorator(withStore(testStore))
  .add("LayoutAuthorized", () => <ErrorBoundaryLayoutAuthorized />)
  .add("LayoutBase", () => <ErrorBoundaryLayoutBase />)
  .add("LayoutUnauthorized", () => <ErrorBoundaryLayoutUnauthorized />)
  .add("Panel", () => <ErrorBoundaryPanel />);
