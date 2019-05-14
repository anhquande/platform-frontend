import * as cn from "classnames";
import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { EETOStateOnChain } from "../../modules/eto/types";
import { TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { getTokenPrice } from "../../modules/investor-portfolio/utils";
import { etoPublicViewLink } from "../appRouteUtils";
import { DashboardHeading } from "../eto/shared/DashboardHeading";
import { EProjectStatusSize, ETOState } from "../eto/shared/ETOState";
import { Container } from "../layouts/Container";
import { ECurrency, ENumberInputFormat } from "../shared/formatters/utils";
import { CurrencyIcon } from "../shared/icons/CurrencyIcon";
import { ECurrencySymbol, Money } from "../shared/Money.unsafe";
import { NumberFormat } from "../shared/NumberFormat";
import { ENewTableCellLayout, NewTable, NewTableRow } from "../shared/table";
import { PortfolioAssetAction } from "./PortfolioAssetAction";

import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  pendingAssets: TETOWithInvestorTicket[];
}

const PortfolioReservedAssets: React.FunctionComponent<IExternalProps> = ({ pendingAssets }) => (
  <Container>
    <DashboardHeading
      title={<FormattedMessage id="portfolio.section.reserved-assets.title" />}
      description={<FormattedMessage id="portfolio.section.reserved-assets.description" />}
    />
    <NewTable
      placeholder={
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.placeholder" />
      }
      titles={[
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
        "",
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
        <>
          <CurrencyIcon currency={ECurrency.NEU} className={cn("mr-2", styles.tokenSmall)} />
          <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
        </>,
        <FormattedMessage id="portfolio.section.reserved-assets.table.header.eto-status" />,
        {
          title: "",
          width: "20%",
        },
      ]}
    >
      {pendingAssets.map(
        ({
          equityTokenImage,
          equityTokenName,
          equityTokenSymbol,
          investorTicket,
          contract,
          etoId,
          product,
          previewCode,
        }) => {
          const timedState = contract!.timedState;
          const isWhitelistedOrPublic =
            timedState === EETOStateOnChain.Whitelist || timedState === EETOStateOnChain.Public;

          return (
            <NewTableRow
              key={etoId}
              data-test-id={`portfolio-reserved-asset-${etoId}`}
              cellLayout={ENewTableCellLayout.MIDDLE}
            >
              <>
                <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                <span className={"d-inline-block"}>
                  <span
                    className={styles.tokenName}
                    data-test-id="portfolio-reserved-asset-token-name"
                  >
                    {equityTokenName} ({equityTokenSymbol})
                  </span>
                </span>
              </>

              <Link
                to={etoPublicViewLink(previewCode, product.jurisdiction)}
                data-test-id="portfolio-reserved-assets-view-profile"
              >
                <FormattedMessage id="portfolio.section.reserved-assets.view-profile" />
              </Link>

              <NumberFormat
                data-test-id="portfolio-reserved-asset-token-balance"
                value={investorTicket.equityTokenInt}
              />

              <Money
                data-test-id="portfolio-reserved-asset-invested-amount"
                value={investorTicket.equivEurUlps}
                currency={ECurrency.EUR}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />

              <Money
                data-test-id="portfolio-reserved-token-price"
                value={getTokenPrice(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}
                currency={ECurrency.EUR}
                currencySymbol={ECurrencySymbol.SYMBOL}
                format={ENumberInputFormat.FLOAT}
                isPrice={true}
              />

              <Money
                data-test-id="portfolio-reserved-asset-neu-reward"
                value={investorTicket.rewardNmkUlps.toString()}
                currency={ECurrency.NEU}
                currencySymbol={ECurrencySymbol.NONE}
              />

              <span data-test-id="portfolio-reserved-asset-status">
                {isWhitelistedOrPublic ? (
                  <span className={"text-uppercase"}>
                    <FormattedMessage
                      id="shared-component.eto-overview.invest.ends-in"
                      values={{
                        endsIn: (
                          <FormattedRelative
                            value={contract!.startOfStates[EETOStateOnChain.Signing]!}
                            style="numeric"
                          />
                        ),
                      }}
                    />
                  </span>
                ) : (
                  <ETOState previewCode={previewCode} size={EProjectStatusSize.SMALL} />
                )}
              </span>

              <PortfolioAssetAction state={timedState} etoId={etoId} />
            </NewTableRow>
          );
        },
      )}
    </NewTable>
  </Container>
);

export { PortfolioReservedAssets };
