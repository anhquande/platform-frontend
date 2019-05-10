import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { EAssetType, EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { TDataTestId, TTranslatedString } from "../../../types";
import { DocumentTemplateButton } from "../../shared/DocumentLink";
import { selectCurrencyCode } from "../../shared/formatters/Money";
import { ECurrency, ENumberInputFormat } from "../../shared/formatters/utils";
import { ECurrencySymbol, Money } from "../../shared/Money.unsafe";
import { NumberFormat } from "../../shared/NumberFormat";
import { Panel } from "../../shared/Panel";
import { Percentage } from "../../shared/Percentage";
import { InvestmentAmount } from "../shared/InvestmentAmount";

import * as styles from "./EtoInvestmentTermsWidget.module.scss";

type TExternalProps = {
  etoData: TEtoWithCompanyAndContract;
};

type TDispatchProps = {
  downloadDocument: (document: IEtoDocument) => void;
};

type TEntryExternalProps = {
  label: TTranslatedString;
  value: React.ReactNode;
};

const Entry: React.FunctionComponent<TEntryExternalProps & TDataTestId> = ({
  label,
  value,
  "data-test-id": dataTestId,
}) => (
  <div className={styles.entry}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value} data-test-id={dataTestId}>
      {value}
    </span>
  </div>
);

const EtoInvestmentTermsWidgetLayout: React.FunctionComponent<TExternalProps & TDispatchProps> = ({
  etoData,
  downloadDocument,
}) => {
  const computedNewSharePrice = etoData.preMoneyValuationEur / etoData.existingCompanyShares;

  return (
    <Panel className={styles.tokenTerms}>
      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.groupTitle}>
            <FormattedMessage id="eto.public-view.token-terms.group-title.equity" />
          </div>
          <div className={styles.groupContent}>
            {etoData.preMoneyValuationEur && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.pre-money-valuation" />}
                value={
                  <Money
                    value={etoData.preMoneyValuationEur}
                    currency={ECurrency.EUR}
                    format={ENumberInputFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                }
                data-test-id="eto-public-view-pre-money-valuation"
              />
            )}
            {etoData.existingCompanyShares && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.existing-shares" />}
                value={<NumberFormat value={etoData.existingCompanyShares} />}
                data-test-id="eto-public-view-existing-shares"
              />
            )}
            {etoData.authorizedCapitalShares && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.authorized-capital" />}
                value={<NumberFormat value={etoData.authorizedCapitalShares} />}
                data-test-id="eto-public-view-authorized-capital"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.new-shares-to-issue" />}
              value={
                <>
                  {etoData.minimumNewSharesToIssue}
                  {" - "}
                  {etoData.newSharesToIssue}
                </>
              }
              data-test-id="eto-public-view-new-shares-to-issue"
            />
            {etoData.newSharesToIssueInWhitelist && (
              <Entry
                label={
                  <FormattedMessage id="eto.public-view.token-terms.new-shares-to-issue-in-whitelist" />
                }
                value={etoData.newSharesToIssueInWhitelist}
                data-test-id="eto-public-view-new-shares-to-issue-in-whitelist"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.new-share-price" />}
              value={
                <Money
                  value={computedNewSharePrice}
                  currency={ECurrency.EUR}
                  format={ENumberInputFormat.FLOAT}
                  currencySymbol={ECurrencySymbol.SYMBOL}
                />
              }
              data-test-id="eto-public-view-new-share-price"
            />
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.investment-amount" />}
              value={<InvestmentAmount etoData={etoData} />}
              data-test-id="eto-public-view-investment-amount"
            />
            {etoData.templates.investmentAndShareholderAgreementTemplate && (
              <DocumentTemplateButton
                title={<FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />}
                onClick={() =>
                  downloadDocument(etoData.templates.investmentAndShareholderAgreementTemplate)
                }
              />
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <div className={styles.groupTitle}>
            <FormattedMessage id="eto.public-view.token-terms.group-title.token-sale" />
          </div>
          <div className={styles.groupContent}>
            {!!etoData.equityTokensPerShare && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.tokens-per-share" />}
                value={<NumberFormat value={etoData.equityTokensPerShare} />}
                data-test-id="eto-public-view-tokens-per-share"
              />
            )}
            {!!(computedNewSharePrice && etoData.equityTokensPerShare) && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.token-price" />}
                value={
                  <Money
                    value={computedNewSharePrice / etoData.equityTokensPerShare}
                    currency={ECurrency.EUR}
                    format={ENumberInputFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                }
                data-test-id="eto-public-view-token-price"
              />
            )}
            {!!etoData.whitelistDiscountFraction && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.whitelist-discount" />}
                value={<Percentage>{etoData.whitelistDiscountFraction}</Percentage>}
                data-test-id="eto-public-view-whitelist-discount"
              />
            )}
            {!!etoData.publicDiscountFraction && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.public-discount" />}
                value={<Percentage>{etoData.publicDiscountFraction}</Percentage>}
                data-test-id="eto-public-view-public-discount"
              />
            )}
            {!!etoData.minTicketEur && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.ticket-size" />}
                value={
                  <Money
                    currency={ECurrency.EUR}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                    value={
                      <>
                        {etoData.minTicketEur}
                        {" - "}
                        {etoData.maxTicketEur ? (
                          etoData.maxTicketEur
                        ) : (
                          <FormattedMessage id="common.number-quantity.unlimited" />
                        )}
                      </>
                    }
                  />
                }
                data-test-id="eto-public-view-ticket-size"
              />
            )}
            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.currencies.label" />}
              value={
                <FormattedMessage
                  id="eto.public-view.token-terms.currencies.value"
                  values={{
                    eth: selectCurrencyCode(ECurrency.ETH),
                    nEur: selectCurrencyCode(ECurrency.EUR_TOKEN),
                  }}
                />
              }
              data-test-id="eto-public-view-currencies"
            />
            {!!etoData.whitelistDurationDays && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.pre-eto-duration" />}
                value={
                  <>
                    {" "}
                    {etoData.whitelistDurationDays}{" "}
                    <FormattedMessage id="eto.public-view.token-terms.days" />
                  </>
                }
                data-test-id="eto-public-view-pre-eto-duration"
              />
            )}
            {!!etoData.publicDurationDays && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.public-eto-duration" />}
                value={
                  <>
                    {" "}
                    {etoData.publicDurationDays}{" "}
                    <FormattedMessage id="eto.public-view.token-terms.days" />
                  </>
                }
                data-test-id="eto-public-view-public-eto-duration"
              />
            )}
            {etoData.product && !!etoData.product.jurisdiction && (
              <Entry
                label={
                  <FormattedMessage id="eto.public-view.token-terms.public-eto.product.jurisdiction" />
                }
                value={
                  <>
                    {etoData.product.jurisdiction === EJurisdiction.GERMANY && (
                      <FormattedMessage
                        id={`eto.public-view.token-terms.public-eto.product.jurisdiction.de`}
                      />
                    )}
                    {etoData.product.jurisdiction === EJurisdiction.LIECHTENSTEIN && (
                      <FormattedMessage
                        id={`eto.public-view.token-terms.public-eto.product.jurisdiction.li`}
                      />
                    )}
                  </>
                }
                data-test-id="eto-public-view-public-eto-duration"
              />
            )}
            {!!etoData.templates.reservationAndAcquisitionAgreement && (
              <DocumentTemplateButton
                title={
                  <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
                }
                onClick={() =>
                  downloadDocument(etoData.templates.reservationAndAcquisitionAgreement)
                }
              />
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.group}>
          <div className={styles.groupTitle}>
            <FormattedMessage id="eto.public-view.token-terms.group-title.token-holder-rights" />
          </div>
          <div className={styles.groupContent}>
            {!!etoData.nominee && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.nominee" />}
                value={etoData.nomineeDisplayName}
                data-test-id="eto-public-view-nominee"
              />
            )}
            {!!etoData.signingDurationDays && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.public-offer-duration" />}
                value={
                  <>
                    {" "}
                    {etoData.signingDurationDays}{" "}
                    <FormattedMessage id="eto.public-view.token-terms.days" />
                  </>
                }
                data-test-id="eto-public-view-public-offer-duration"
              />
            )}

            <Entry
              label={<FormattedMessage id="eto.public-view.token-transferability" />}
              value={
                etoData.enableTransferOnSuccess ? (
                  <FormattedMessage id="eto.public-view.token-transferability.yes" />
                ) : (
                  <FormattedMessage id="eto.public-view.token-transferability.no" />
                )
              }
              data-test-id="eto-public-view-token-transferability"
            />

            {etoData.enableTransferOnSuccess && (
              <Entry
                label={<FormattedMessage id="eto.public-view.token-terms.token-tradability" />}
                value={
                  <>
                    {etoData.tokenTradeableOnSuccess ? (
                      <FormattedMessage id="eto.public-view.token-terms.enabled" />
                    ) : (
                      <FormattedMessage id="eto.public-view.token-terms.disabled" />
                    )}
                  </>
                }
                data-test-id="eto-public-view-token-tradability"
              />
            )}

            {etoData.product && (
              <Entry
                label={<FormattedMessage id="eto.public-view.asset-type" />}
                value={
                  etoData.product.assetType === EAssetType.SECURITY ? (
                    <FormattedMessage id={`eto.public-view.asset-type.security`} />
                  ) : (
                    <FormattedMessage id={`eto.public-view.asset-type.vma`} />
                  )
                }
                data-test-id="eto-public-view-asset-type"
              />
            )}

            <Entry
              label={<FormattedMessage id="eto.public-view.token-terms.voting-rights" />}
              value={
                etoData.generalVotingRule === "negative" ? (
                  <FormattedMessage id="eto.public-view.token-terms.no" />
                ) : (
                  <FormattedMessage id="eto.public-view.token-terms.yes" />
                )
              }
              data-test-id="eto-public-view-voting-rights"
            />
            <Entry
              label={<FormattedMessage id="eto.public-view.dividend-rights" />}
              value={<FormattedMessage id="eto.public-view.dividend-rights.yes" />}
              data-test-id="eto-public-view-dividend-rights"
            />

            {!!etoData.templates.companyTokenHolderAgreement && (
              <DocumentTemplateButton
                title={<FormattedMessage id="eto.documents.tokenholder-agreement" />}
                onClick={() => downloadDocument(etoData.templates.companyTokenHolderAgreement)}
              />
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
};

const EtoInvestmentTermsWidget = compose<TExternalProps & TDispatchProps, TExternalProps>(
  appConnect<{}, TDispatchProps, TExternalProps>({
    dispatchToProps: dispatch => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.eto.downloadEtoDocument(document)),
    }),
  }),
)(EtoInvestmentTermsWidgetLayout);

export { EtoInvestmentTermsWidget, EtoInvestmentTermsWidgetLayout };
