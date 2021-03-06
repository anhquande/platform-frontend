import * as cn from "classnames";
import { push } from "connected-react-router";
import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { CounterWidget, TagsWidget } from ".";
import { EEtoDocumentType } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { getShareAndTokenPrice } from "../../../../lib/api/eto/EtoUtils";
import { selectIsAuthorized } from "../../../../modules/auth/selectors";
import { selectEtoOnChainStateById } from "../../../../modules/eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import {
  selectInitialMaxCapExceeded,
  selectIsEligibleToPreEto,
} from "../../../../modules/investor-portfolio/selectors";
import { routingActions } from "../../../../modules/routing/actions";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { Container, EColumnSpan } from "../../../layouts/Container";
import { FormatNumber } from "../../../shared/formatters/FormatNumber";
import { MoneyNew } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
} from "../../../shared/formatters/utils";
import { EtoWidgetContext } from "../../EtoWidgetView";
import { EProjectStatusType, ETOState } from "../../shared/ETOState";
import { InvestmentAmount } from "../../shared/InvestmentAmount";
import { ToBeAnnounced, ToBeAnnouncedTooltip } from "../../shared/ToBeAnnouncedTooltip";
import { CampaigningActivatedWidget } from "./CampaigningWidget";
import { ClaimWidget, RefundWidget } from "./ClaimRefundWidget";
import { EtoMaxCapExceededWidget } from "./EtoMaxCapExceeded";
import { InvestmentWidget } from "./InvestmentWidget";
import { RegisterNowWidget } from "./RegisterNowWidget";
import { TokenSymbolWidget } from "./TokenSymbolWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
  publicView?: boolean;
}

interface IStatusOfEto {
  previewCode: string;
}

interface IDispatchProps {
  navigateToEto: () => void;
  openInNewWindow: () => void;
}

interface IStateProps {
  isAuthorized: boolean;
  isEligibleToPreEto: boolean;
  isPreEto?: boolean;
  maxCapExceeded: boolean;
}

const StatusOfEto: React.FunctionComponent<IStatusOfEto> = ({ previewCode }) => (
  <div className={styles.statusOfEto}>
    <span className={styles.title}>
      <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
    </span>
    <ETOState previewCode={previewCode} type={EProjectStatusType.EXTENDED} />
  </div>
);

const PoweredByNeufund = () => (
  <div className={styles.poweredByNeufund} data-test-id="eto-overview-powered-by">
    <div className={styles.powered}>Powered by</div>
    <Link className={styles.neufund} target={"_blank"} to={"https://neufund.org"}>
      NEUFUND
    </Link>
  </div>
);

const EtoStatusManager = ({
  eto,
  isAuthorized,
  isEligibleToPreEto,
  maxCapExceeded,
}: IExternalProps & IStateProps) => {
  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = eto.contract ? eto.contract.timedState : EETOStateOnChain.Setup;
  const isEtoActive =
    (isEligibleToPreEto && timedState === EETOStateOnChain.Whitelist) ||
    timedState === EETOStateOnChain.Public;

  if (maxCapExceeded && isEtoActive) {
    return <EtoMaxCapExceededWidget eto={eto} />;
  }

  switch (timedState) {
    case EETOStateOnChain.Setup: {
      if (isAuthorized) {
        const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;
        const nextStateStartDate = eto.contract ? eto.contract.startOfStates[nextState] : undefined;

        return (
          <CampaigningActivatedWidget
            maxPledge={eto.maxTicketEur}
            minPledge={eto.minTicketEur}
            etoId={eto.etoId}
            investorsLimit={eto.maxPledges}
            nextState={nextState}
            nextStateStartDate={nextStateStartDate}
            isActive={eto.isBookbuilding}
            keyQuoteFounder={eto.company.keyQuoteFounder}
          />
        );
      } else {
        return <RegisterNowWidget />;
      }
    }
    case EETOStateOnChain.Whitelist: {
      if (isEligibleToPreEto) {
        return <InvestmentWidget eto={eto} />;
      } else {
        return (
          <CounterWidget
            endDate={eto.contract!.startOfStates[EETOStateOnChain.Public]!}
            state={EETOStateOnChain.Public}
          />
        );
      }
    }

    case EETOStateOnChain.Public: {
      return <InvestmentWidget eto={eto} />;
    }

    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Signing:
    case EETOStateOnChain.Payout: {
      return (
        <ClaimWidget
          etoId={eto.etoId}
          tokenName={eto.equityTokenName || ""}
          totalInvestors={eto.contract!.totalInvestment.totalInvestors}
          totalEquivEurUlps={eto.contract!.totalInvestment.totalEquivEurUlps}
          timedState={timedState}
        />
      );
    }

    case EETOStateOnChain.Refund: {
      return <RefundWidget etoId={eto.etoId} timedState={timedState} />;
    }

    default:
      throw new Error(`State (${timedState}) is not known. Please provide implementation.`);
  }
};

function applyDiscountToPrice(price: number, discountFraction: number): number {
  return price * (1 - discountFraction);
}

function onEtoNavigationClick(
  navigate: () => void,
  openInNewWindow: (() => void) | undefined,
): (event: React.MouseEvent<HTMLDivElement>) => void {
  return function({ target, currentTarget }: React.MouseEvent<HTMLDivElement>): void {
    if (target === currentTarget) {
      if (openInNewWindow) {
        openInNewWindow();
        return;
      }
      navigate();
    }
  };
}

const EtoOverviewStatusLayout: React.FunctionComponent<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps
> = ({
  eto,
  className,
  isAuthorized,
  isEligibleToPreEto,
  isPreEto,
  maxCapExceeded,
  navigateToEto,
  publicView,
  openInNewWindow,
}) => {
  const smartContractOnChain = !!eto.contract;

  const documentsByType = keyBy(eto.documents, document => document.documentType);

  let { tokenPrice } = getShareAndTokenPrice(eto);

  const showWhitelistDiscount = !!eto.whitelistDiscountFraction && isEligibleToPreEto && isPreEto;

  const showPublicDiscount = Boolean(!showWhitelistDiscount && eto.publicDiscountFraction);

  if (showWhitelistDiscount) {
    tokenPrice = applyDiscountToPrice(tokenPrice, eto.whitelistDiscountFraction!);
  }

  if (showPublicDiscount) {
    tokenPrice = applyDiscountToPrice(tokenPrice, eto.publicDiscountFraction!);
  }

  return (
    <EtoWidgetContext.Consumer>
      {previewCode => (
        <Container
          className={cn(styles.etoOverviewStatus, className)}
          data-test-id={`eto-overview-${eto.etoId}`}
          columnSpan={EColumnSpan.THREE_COL}
        >
          <StatusOfEto previewCode={eto.previewCode} />
          <div
            className={styles.overviewWrapper}
            onClick={onEtoNavigationClick(navigateToEto, previewCode ? openInNewWindow : undefined)}
          >
            <div
              className={cn(styles.statusWrapper, styles.breakSm)}
              onClick={onEtoNavigationClick(
                navigateToEto,
                previewCode ? openInNewWindow : undefined,
              )}
            >
              <Link
                to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
                target={previewCode ? "_blank" : ""}
                data-test-id="eto-overview-status-token"
              >
                <TokenSymbolWidget
                  brandName={eto.company.brandName}
                  tokenImage={{
                    alt: eto.equityTokenName || "",
                    srcSet: { "1x": eto.equityTokenImage || "" },
                  }}
                  tokenName={eto.equityTokenName}
                  tokenSymbol={eto.equityTokenSymbol || ""}
                />
              </Link>
            </div>

            <div className={cn(styles.divider, "d-none", "d-lg-block")} />

            <div className={styles.tagsWrapper}>
              <TagsWidget
                companyPitchdeckUrl={eto.company.companyPitchdeckUrl}
                etoId={eto.etoId}
                jurisdiction={eto.product.jurisdiction}
                offeringDocumentType={eto.product.offeringDocumentType}
                termSheet={documentsByType[EEtoDocumentType.SIGNED_TERMSHEET]}
                prospectusApproved={
                  documentsByType[EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT]
                }
                smartContractOnChain={smartContractOnChain}
                innerClass={styles.tagItem}
              />
            </div>

            <div
              className={cn(
                styles.divider,
                "d-md-none",
                "d-lg-block",
                "d-xl-block",
                styles.breakSm,
              )}
            />

            <div className={cn(styles.groupWrapper, styles.breakSm)}>
              <div className={styles.groupTable}>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.key-investment-terms" />
                    {":"}
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
                  </span>
                  <span className={styles.value}>
                    <MoneyNew
                      value={eto.preMoneyValuationEur}
                      inputFormat={ENumberInputFormat.FLOAT}
                      moneyFormat={ECurrency.EUR}
                      outputFormat={ENumberOutputFormat.INTEGER}
                      defaultValue={<ToBeAnnouncedTooltip />}
                    />
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.investment-amount" />
                  </span>
                  <span className={styles.value}>
                    <InvestmentAmount etoData={eto} />
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
                  </span>
                  <span className={styles.value}>
                    <FormatNumber
                      value={eto.newSharesToIssue}
                      inputFormat={ENumberInputFormat.FLOAT}
                      outputFormat={ENumberOutputFormat.INTEGER}
                      defaultValue={<ToBeAnnounced />}
                    />
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
                  </span>
                  <span className={styles.value}>
                    <MoneyNew
                      value={tokenPrice}
                      inputFormat={ENumberInputFormat.FLOAT}
                      moneyFormat={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                      outputFormat={ENumberOutputFormat.FULL}
                      defaultValue={<ToBeAnnounced />}
                    />
                    {showWhitelistDiscount && (
                      <>
                        {" ("}
                        <FormattedMessage
                          id="shared-component.eto-overview-status.included-discount-percentage"
                          values={{ percentage: eto.whitelistDiscountFraction! * 100 }}
                        />
                        {")"}
                      </>
                    )}
                    {showPublicDiscount && (
                      <>
                        {" ("}
                        <FormattedMessage
                          id="shared-component.eto-overview-status.included-discount-percentage"
                          values={{ percentage: eto.publicDiscountFraction! * 100 }}
                        />
                        {")"}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className={cn(styles.divider, styles.breakMd)} />

            <div className={cn(styles.stageContentWrapper, styles.breakMd)}>
              <EtoStatusManager
                eto={eto}
                isAuthorized={isAuthorized}
                isEligibleToPreEto={isEligibleToPreEto}
                maxCapExceeded={maxCapExceeded}
              />
            </div>
          </div>
          {previewCode ? (
            <PoweredByNeufund />
          ) : !publicView ? (
            <Link
              className={styles.moreDetails}
              to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
            >
              <FormattedMessage id="shared-component.eto-overview.more-details" />
            </Link>
          ) : null}
        </Container>
      )}
    </EtoWidgetContext.Consumer>
  );
};

const EtoOverviewStatus = compose<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<IStateProps, IDispatchProps, IExternalProps>({
    stateToProps: (state, props) => ({
      isAuthorized: selectIsAuthorized(state.auth),
      isEligibleToPreEto: selectIsEligibleToPreEto(state, props.eto.etoId),
      isPreEto: selectEtoOnChainStateById(state, props.eto.etoId) === EETOStateOnChain.Whitelist,
      maxCapExceeded: selectInitialMaxCapExceeded(state, props.eto.etoId),
    }),
    dispatchToProps: (dispatch, { eto }) => ({
      navigateToEto: () =>
        dispatch(push(etoPublicViewLink(eto.previewCode, eto.product.jurisdiction))),
      openInNewWindow: () =>
        dispatch(
          routingActions.openInNewWindow(
            etoPublicViewLink(eto.previewCode, eto.product.jurisdiction),
          ),
        ),
    }),
  }),
)(EtoOverviewStatusLayout);

export { EtoOverviewStatusLayout, EtoOverviewStatus };
