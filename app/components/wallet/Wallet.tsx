import * as React from "react";
import { compose } from "redux";

import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { WalletRouter } from "./Router";

export const WalletComponent: React.FunctionComponent = () => (
  <LayoutAuthorized>
    <WalletRouter />
  </LayoutAuthorized>
);

export const Wallet = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.wallet") })),
)(WalletComponent);
