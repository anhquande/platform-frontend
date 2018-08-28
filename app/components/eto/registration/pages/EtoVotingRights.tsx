import { FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoVotingRightsType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormToggle } from "../../../shared/forms/formField/FormToggle";
import { BOOL_TRUE_KEY, FormSelectField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";

// TODO: this keys will be replaced dynamically by addresses from an API endpoint, once there are more than one
const TOKEN_HOLDERS_RIGHTS = {
  [BOOL_TRUE_KEY]: "Neumini UG",
};

const LIQUIDATION_PREFERENCE_VALUES = [0, 1, 1.5, 2];

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IStateProps & IDispatchProps;

class EtoForm extends React.Component<FormikProps<TPartialEtoSpecData> & IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    return (
      <EtoFormBase
        title={<FormattedMessage id="eto.form.eto-voting-rights.title" />}
        validator={EtoVotingRightsType.toYup()}
      >
        <FormSelectField
          values={TOKEN_HOLDERS_RIGHTS}
          label={<FormattedMessage id="eto.form.section.token-holders-rights.nominee" />}
          name="nominee"
        />

        <FormSelectField
          customOptions={LIQUIDATION_PREFERENCE_VALUES.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
          label={
            <FormattedMessage id="eto.form.section.token-holders-rights.liquidation-preference" />
          }
          name="liquidationPreferenceMultiplier"
        />

        <div className="form-group">
          <FormLabel>
            <FormattedMessage id="eto.form.section.token-holders-rights.voting-rights-enabled" />
          </FormLabel>
          <FormToggle
            name="generalVotingRule"
            trueValue="positive"
            falseValue="no_voting_rights"
            disabledLabel={<FormattedMessage id="form.select.no" />}
            enabledLabel={<FormattedMessage id="form.select.yes" />}
          />
        </div>

        <Col>
          <Row className="justify-content-center">
            <Button
              layout="primary"
              type="submit"
              onClick={() => {
                this.props.saveData(this.props.values);
              }}
              isLoading={this.props.savingData}
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </Row>
        </Col>
      </EtoFormBase>
    );
  }
}

const EtoEnhancedForm = withFormik<IProps, TPartialEtoSpecData>({
  validationSchema: EtoVotingRightsType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoVotingRightsComponent: React.SFC<IProps> = props => <EtoEnhancedForm {...props} />;

export const EtoVotingRights = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.etoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialEtoSpecData) => {
        data.liquidationPreferenceMultiplier = parseFloat(
          `${data.liquidationPreferenceMultiplier}`,
        ); // Changes option's string value to number so it meets swagger requirements

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
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoVotingRightsComponent);
