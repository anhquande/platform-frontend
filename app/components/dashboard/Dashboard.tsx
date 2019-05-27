import * as React from "react";

import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoList } from "./eto-list/EtoList";
import { MyPortfolioWidget } from "./my-portfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./my-wallet/MyWalletWidget";

export const Dashboard = () => (
  <LayoutAuthorized data-test-id="dashboard-application">
    <WidgetGridLayout>
      <MyPortfolioWidget />
      <MyWalletWidget />
      {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && <EtoList />}
    </WidgetGridLayout>
  </LayoutAuthorized>
);
