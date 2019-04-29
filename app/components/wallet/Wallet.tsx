import * as React from "react";
import { compose } from "redux";

import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { WalletRouter } from "./Router";

import * as layoutStyles from "../layouts/Layout.module.scss";

export const WalletComponent: React.FunctionComponent = () => (
  <LayoutAuthorized>
    <WidgetGridLayout data-test-id="wallet-start-container" className={layoutStyles.layoutOffset}>
      <WalletRouter />
    </WidgetGridLayout>
  </LayoutAuthorized>
);

export const Wallet = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.wallet") })),
)(WalletComponent);
