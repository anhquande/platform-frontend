import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { getTokenPrice } from "../../modules/investor-portfolio/utils";
import { withParams } from "../../utils/withParams";
import { appRoutes } from "../appRoutes";
import { EProjectStatusSize, ETOState } from "../eto/shared/ETOState";
import { Container } from "../layouts/Container";
import { Heading } from "../shared/Heading";
import { CurrencyIcon } from "../shared/icons/CurrencyIcon";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../shared/Money.unsafe";
import { NumberFormat } from "../shared/NumberFormat";
import { ENewTableCellLayout, NewTable, NewTableRow } from "../shared/table";

import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  pastInvestments: TETOWithInvestorTicket[];
}

const PortfolioPastInvestments: React.FunctionComponent<IExternalProps> = ({ pastInvestments }) => (
  <Container>
    <Heading
      level={3}
      decorator={false}
      description={<FormattedMessage id="portfolio.section.past-investments.description" />}
    >
      <FormattedMessage id="portfolio.section.past-investments.title" />
    </Heading>

    <NewTable
      keepRhythm={true}
      placeholder={
        <FormattedMessage id="portfolio.section.past-investments.table.header.placeholder" />
      }
      titles={[
        <FormattedMessage id="portfolio.section.past-investments.table.header.date" />,
        <FormattedMessage id="portfolio.section.past-investments.table.header.token" />,
        "",
        <FormattedMessage id="portfolio.section.past-investments.table.header.quantity" />,
        <FormattedMessage id="portfolio.section.past-investments.table.header.value-eur" />,
        <FormattedMessage id="portfolio.section.past-investments.table.header.price-eur" />,
        <>
          <CurrencyIcon currency={ECurrency.NEU} className={cn("mr-2", styles.tokenSmall)} />
          <FormattedMessage id="portfolio.section.past-investments.table.header.neu-reward" />
        </>,
        <FormattedMessage id="portfolio.section.past-investments.table.header.eto-status" />,
      ]}
    >
      {pastInvestments.map(
        ({
          equityTokenImage,
          equityTokenName,
          equityTokenSymbol,
          investorTicket,
          contract,
          etoId,
          previewCode,
        }) => {
          const timedState = contract!.timedState;
          const investmentDate = contract!.startOfStates[timedState]!;

          return (
            <NewTableRow
              key={etoId}
              data-test-id={`past-investments-${etoId}`}
              cellLayout={ENewTableCellLayout.MIDDLE}
            >
              <FormattedDate value={investmentDate} />
              <>
                <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                <span className={styles.tokenName} data-test-id="past-investments-token-name">
                  {equityTokenName} ({equityTokenSymbol})
                </span>
              </>

              <Link
                to={withParams(appRoutes.etoPublicView, { previewCode })}
                data-test-id="portfolio-past-investments-view-profile"
              >
                <FormattedMessage id="portfolio.section.reserved-assets.view-profile" />
              </Link>

              <NumberFormat
                data-test-id="past-investments-token-balance"
                value={investorTicket.equityTokenInt}
              />

              <Money
                data-test-id="past-investments-invested-amount"
                value={investorTicket.equivEurUlps}
                currency={ECurrency.EUR}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />

              <Money
                data-test-id="past-investments-token-price"
                value={getTokenPrice(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}
                currency={ECurrency.EUR}
                currencySymbol={ECurrencySymbol.SYMBOL}
                format={EMoneyFormat.FLOAT}
                isPrice={true}
              />

              <Money
                data-test-id="past-investments-asset-neu-reward"
                value={investorTicket.rewardNmkUlps.toString()}
                currency={ECurrency.NEU}
                currencySymbol={ECurrencySymbol.NONE}
              />
              <ETOState previewCode={previewCode} size={EProjectStatusSize.SMALL} />
            </NewTableRow>
          );
        },
      )}
    </NewTable>
  </Container>
);

export { PortfolioPastInvestments };
