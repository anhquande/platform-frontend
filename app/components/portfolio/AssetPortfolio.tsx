import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { ITokenDisbursal } from "../../modules/investor-portfolio/types";
import { appConnect } from "../../store";
import { DashboardHeading } from "../eto/shared/DashboardHeading";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { Button, ButtonSize, EButtonLayout, EButtonTheme } from "../shared/buttons";
import { selectCurrencyCode } from "../shared/formatters/Money";
import { Heading } from "../shared/Heading";
import { CurrencyIcon } from "../shared/icons/CurrencyIcon";
import { LoadingIndicator } from "../shared/loading-indicator";
import { ETheme, Money } from "../shared/Money.unsafe";
import { Panel } from "../shared/Panel";
import { NewTable, NewTableRow } from "../shared/table";

import * as neuIcon from "../../assets/img/neu_icon.svg";

interface IExternalProps {
  tokensDisbursal: ReadonlyArray<ITokenDisbursal> | undefined;
  isVerifiedInvestor: boolean;
}

interface ILayoutProps {
  tokensDisbursal: ReadonlyArray<ITokenDisbursal>;
  isVerifiedInvestor: boolean;
}

interface IDispatchToProps {
  redistributePayout: (tokenDisbursal: ITokenDisbursal) => void;
  acceptPayout: (tokenDisbursal: ITokenDisbursal) => void;
  acceptCombinedPayout: (tokensDisbursal: ReadonlyArray<ITokenDisbursal>) => void;
}

const AssetPortfolioLayoutNoPayouts: React.FunctionComponent = () => (
  <Container>
    <DashboardHeading
      data-test-id="asset-portfolio.no-payouts"
      className="mb-4"
      title={<FormattedMessage id="portfolio.section.asset-portfolio.title" />}
      description={<FormattedMessage id="portfolio.asset.payouts-from-neu.no-payouts" />}
    />
  </Container>
);

const AssetPortfolioLayout: React.FunctionComponent<ILayoutProps & IDispatchToProps> = ({
  tokensDisbursal,
  redistributePayout,
  acceptPayout,
  acceptCombinedPayout,
  isVerifiedInvestor,
}) => (
  <Container type={EContainerType.INHERIT_GRID}>
    <Container columnSpan={EColumnSpan.ONE_COL}>
      <Heading level={3} decorator={false}>
        <FormattedMessage id="portfolio.section.asset-portfolio.title" />
      </Heading>

      <Panel>
        <p data-test-id="asset-portfolio.payout-text">
          <FormattedMessage
            id="portfolio.asset.amounts-to-claim"
            values={{
              amounts: (
                <>
                  {tokensDisbursal
                    .map(t => (
                      <Money
                        key={t.token}
                        value={t.amountToBeClaimed}
                        currency={t.token}
                        theme={ETheme.GREEN_BIG}
                      />
                    ))
                    // add + between nodes
                    .reduce<React.ReactNode[]>(
                      (p, c) => (p.length === 0 ? p.concat(c) : p.concat(" + ", c)),
                      [],
                    )}
                </>
              ),
            }}
          />
        </p>
        <p className="mb-0">
          <FormattedMessage id="portfolio.asset.amounts-to-claim-description" />
        </p>
      </Panel>
    </Container>
    <Container columnSpan={EColumnSpan.TWO_COL}>
      <Heading level={3} decorator={neuIcon}>
        <FormattedMessage id="portfolio.asset.payouts-from-neu.title" />
      </Heading>

      <NewTable
        titles={[
          "", // token icon
          <FormattedMessage id="portfolio.asset.payouts-from-neu.your-share" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.total-payout" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.claim-by" />,
          "", // reject payout
          "", // accept payout
        ]}
      >
        {tokensDisbursal.map(tokenDisbursal => (
          <NewTableRow
            key={tokenDisbursal.token}
            data-test-id={`asset-portfolio.payout-${tokenDisbursal.token}`}
          >
            <>
              <CurrencyIcon currency={tokenDisbursal.token} className="mr-2" />
              {selectCurrencyCode(tokenDisbursal.token)}
            </>
            <Money
              data-test-id={`asset-portfolio.payout.amount-to-be-claimed`}
              value={tokenDisbursal.amountToBeClaimed}
              currency={tokenDisbursal.token}
              theme={ETheme.GREEN}
            />
            <Money value={tokenDisbursal.totalDisbursedAmount} currency={tokenDisbursal.token} />
            <FormattedDate value={tokenDisbursal.timeToFirstDisbursalRecycle} />
            <Button
              disabled={!isVerifiedInvestor}
              data-test-id="asset-portfolio.payout.redistribute-payout"
              size={ButtonSize.SMALL}
              onClick={() => redistributePayout(tokenDisbursal)}
              layout={EButtonLayout.SECONDARY}
            >
              <FormattedMessage id="portfolio.asset.payouts-from-neu.redistribute-payout" />
            </Button>
            <Button
              disabled={!isVerifiedInvestor}
              data-test-id="asset-portfolio.payout.accept-payout"
              theme={EButtonTheme.GREEN}
              size={ButtonSize.SMALL}
              onClick={() => acceptPayout(tokenDisbursal)}
              layout={EButtonLayout.SECONDARY}
            >
              <FormattedMessage id="portfolio.asset.payouts-from-neu.accept-payout" />
            </Button>
          </NewTableRow>
        ))}
        <NewTableRow>
          <></>
          <></>
          <></>
          <></>
          <></>
          <Button
            disabled={!isVerifiedInvestor}
            data-test-id="asset-portfolio.payout.accept-all-payouts"
            theme={EButtonTheme.GREEN}
            size={ButtonSize.SMALL}
            onClick={() => acceptCombinedPayout(tokensDisbursal)}
            layout={EButtonLayout.SECONDARY}
          >
            <FormattedMessage id="portfolio.asset.payouts-from-neu.accept-all-payout" />
          </Button>
        </NewTableRow>
      </NewTable>
    </Container>
  </Container>
);

const AssetPortfolio = compose<ILayoutProps & IDispatchToProps, IExternalProps>(
  appConnect<{}, IDispatchToProps>({
    dispatchToProps: dispatch => ({
      redistributePayout: (tokenDisbursal: ITokenDisbursal) =>
        dispatch(actions.txTransactions.startInvestorPayoutRedistribute(tokenDisbursal)),
      acceptPayout: (tokenDisbursal: ITokenDisbursal) =>
        dispatch(actions.txTransactions.startInvestorPayoutAccept([tokenDisbursal])),
      acceptCombinedPayout: (tokensDisbursal: ReadonlyArray<ITokenDisbursal>) =>
        dispatch(actions.txTransactions.startInvestorPayoutAccept(tokensDisbursal)),
    }),
  }),
  // Loading
  branch<IExternalProps>(
    ({ tokensDisbursal }) => tokensDisbursal === undefined,
    renderComponent(LoadingIndicator),
  ),
  // No payouts
  branch<ILayoutProps>(
    ({ tokensDisbursal }) => tokensDisbursal.length === 0,
    renderComponent(AssetPortfolioLayoutNoPayouts),
  ),
)(AssetPortfolioLayout);

export { AssetPortfolio };
