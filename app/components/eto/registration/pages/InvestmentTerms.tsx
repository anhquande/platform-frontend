import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoInvestmentTermsType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { formatMoney } from "../../../../utils/Money.utils";
import { Button } from "../../../shared/Buttons";
import { FormTransformingField } from "../../../shared/forms/formField/FormTransformingField";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<TPartialEtoSpecData>;

const EtoInvestmentTermsComponent: React.SFC<IProps> = ({
  stateValues,
  savingData,
  readonly,
  values,
  saveData,
}) => {
  const preMoneyValuationEur = stateValues.preMoneyValuationEur || 1;
  const existingCompanyShares = stateValues.existingCompanyShares || 1;
  const newSharesToIssue = stateValues.newSharesToIssue || 1;
  const equityTokensPerShare = stateValues.equityTokensPerShare || 1;
  const minimumNewSharesToIssue = stateValues.minimumNewSharesToIssue || 0;

  const computedNewSharePrice = preMoneyValuationEur / existingCompanyShares;
  const computedMaxNumberOfTokens = newSharesToIssue * equityTokensPerShare;
  const computedMinNumberOfTokens = minimumNewSharesToIssue * equityTokensPerShare;
  const computedMaxCapPercent = (newSharesToIssue / existingCompanyShares) * 100;
  const computedMinCapPercent = (minimumNewSharesToIssue / existingCompanyShares) * 100;

  const computedTokenPrice = computedNewSharePrice / equityTokensPerShare;

  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.investment-terms.title" />}
      validator={EtoInvestmentTermsType.toYup()}
    >
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.tokens-per-share" />}
        placeholder="1000000"
        name="equityTokensPerShare"
        disabled
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.share-nominal-value" />}
        placeholder="1"
        prefix="€"
        name="shareNominalValueEur"
        type="number"
        min="1"
        disabled={readonly}
      />
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.fully-diluted-pre-money-valuation" />
        }
        placeholder=" "
        prefix="€"
        name="preMoneyValuationEur"
        type="number"
        min="1"
        disabled={readonly}
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.existing-shares" />}
        placeholder="Number of existing shares"
        name="existingCompanyShares"
        type="number"
        min="1"
        disabled={readonly}
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.authorized-capital" />}
        placeholder="Number of shares"
        name="authorizedCapitalShares"
        type="number"
        disabled={readonly}
      />
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.minimum-new-shares-to-issue" />
        }
        placeholder="Number of share"
        name="minimumNewSharesToIssue"
        type="number"
        min="1"
        disabled={readonly}
      />
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.maximum-new-shares-to-issue" />
        }
        placeholder="Number of share"
        name="newSharesToIssue"
        type="number"
        min="1"
        disabled={readonly}
      />
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.maximum-new-shares-to-issue-pre-eto" />
        }
        placeholder="Number of share"
        name="newSharesToIssueInWhitelist"
        type="number"
        min="1"
        disabled={readonly}
      />
      <FormTransformingField
        label={<FormattedMessage id="eto.form.section.investment-terms.whitelist-discount" />}
        placeholder=" "
        name="whitelistDiscountFraction"
        type="number"
        prefix="%"
        ratio={100}
        disabled={readonly}
      />

      <FormHighlightGroup>
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
          prefix="€"
          name="newSharePrice"
          value={formatMoney(`${computedNewSharePrice}`, 1, 8)}
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.equity-token-price" />}
          name="equityTokenPrice"
          prefix="€"
          placeholder="read only"
          value={formatMoney(`${computedTokenPrice}`, 1, 8)}
          disabled
        />
        <Row>
          <Col sm={12} md={6} className="mb-4">
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
              prefix="€"
              placeholder="read only"
              name="minNumberOfTokens"
              value={computedMinNumberOfTokens}
              disabled
            />
          </Col>
          <Col sm={12} md={6} className="mb-4">
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.total-investment" />}
              prefix="€"
              placeholder="read only"
              name="totalInvestment"
              value={computedMaxNumberOfTokens}
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />}
              placeholder="read only"
              name="minCapEur"
              value={computedMinNumberOfTokens}
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />}
              placeholder="read only"
              name="maxCapEur"
              value={computedMaxNumberOfTokens}
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={
                <FormattedMessage id="eto.form.section.investment-terms.minimum-shares-generated" />
              }
              prefix="%"
              name="minSharesGenerated"
              value={computedMinCapPercent.toFixed(4)}
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={
                <FormattedMessage id="eto.form.section.investment-terms.maximum-shares-generated" />
              }
              prefix="%"
              name="maxSharesGenerated"
              value={computedMaxCapPercent.toFixed(4)}
              disabled
            />
          </Col>
        </Row>
      </FormHighlightGroup>

      {!readonly && (
        <Col>
          <Row className="justify-content-center">
            <Button
              layout="primary"
              type="submit"
              isLoading={savingData}
              onClick={() => {
                // we need to submit data like this only b/c formik doesnt support calling props.submitForm with invalid form state
                saveData(values);
              }}
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </Row>
        </Col>
      )}
    </EtoFormBase>
  );
};

export const EtoInvestmentTerms = compose<React.SFC<IExternalProps>>(
  setDisplayName("EtoInvestmentTerms"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.etoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: {
              ...data,
            },
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialEtoSpecData>({
    validationSchema: EtoInvestmentTermsType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoInvestmentTermsComponent);
