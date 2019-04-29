import * as React from "react";

import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { ITokenDisbursal, TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { WidgetGridLayout } from "../layouts/Layout";
import { AssetPortfolio } from "./AssetPortfolio";
import { PortfolioMyAssets } from "./PortfolioMyAssets";
import { PortfolioPastInvestments } from "./PortfolioPastInvestments";
import { PortfolioReservedAssets } from "./PortfolioReservedAssets";

import * as styles from "./PortfolioLayout.module.scss";

export type TPortfolioLayoutProps = {
  myAssets: TEtoWithCompanyAndContract[];
  walletAddress: string;
  pendingAssets: TETOWithInvestorTicket[];
  isRetailEto: boolean;
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
  isVerifiedInvestor: boolean;
  pastInvestments: TETOWithInvestorTicket[];
};

export type IPortfolioDispatchProps = {
  loadTokensData: () => void;
};

const PortfolioLayout: React.FunctionComponent<TPortfolioLayoutProps> = ({
  pendingAssets,
  walletAddress,
  isRetailEto,
  tokensDisbursal,
  isVerifiedInvestor,
  pastInvestments,
}) => (
  <WidgetGridLayout className={styles.portfolio} data-test-id="portfolio-layout">
    {(process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1" ||
      process.env.STORYBOOK_RUN === "1") && (
      <AssetPortfolio tokensDisbursal={tokensDisbursal} isVerifiedInvestor={isVerifiedInvestor} />
    )}

    <PortfolioReservedAssets pendingAssets={pendingAssets} />
    <PortfolioMyAssets isRetailEto={isRetailEto} walletAddress={walletAddress} />
    <PortfolioPastInvestments pastInvestments={pastInvestments} />
  </WidgetGridLayout>
);

export { PortfolioLayout };
