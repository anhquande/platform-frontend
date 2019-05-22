import * as React from "react";

import { EColumnSpan } from "../layouts/Container";
import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoList } from "./eto-list/EtoList";
import { MyPortfolioWidget } from "./my-portfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./my-wallet/MyWalletWidget";

export const Dashboard = () => (
  <LayoutAuthorized>
    <WidgetGridLayout data-test-id="dashboard-application">
      <MyPortfolioWidget columnSpan={EColumnSpan.TWO_COL} />
      <MyWalletWidget columnSpan={EColumnSpan.ONE_COL} />

      {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && <EtoList />}
    </WidgetGridLayout>
  </LayoutAuthorized>
);
