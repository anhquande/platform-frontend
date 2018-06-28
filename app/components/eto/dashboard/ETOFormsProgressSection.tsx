import * as React from "react";
import { Col } from "reactstrap";
import { compose } from "redux";
import {
  EtoCompanyInformationType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoProductVisionType,
  EtoTermsType,
} from "../../../lib/api/EtoApi.interfaces";
import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserEmailVerified } from "../../../modules/auth/selectors";
import { etoFlowInitialState } from "../../../modules/eto-flow/reducer";
import { selectFormFractionDone } from "../../../modules/eto-flow/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

interface IStateProps {
  companyInformationProgress: number;
  productVisionProgress: number;
  legalInformationProgress: number;
  etoKeyIndividualsProgress: number;
  etoTermsProgress: number;
  loadingData: boolean;
  businessRequestStateLoading: boolean;
  kycStatus?: TRequestStatus;
  isEmailVerified: boolean;
}

interface IDispatchProps {
  loadDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

class ETOFormsProgressSectionWidget extends React.Component<IProps> {
  componentDidUpdate(): void {
    const { kycStatus, isEmailVerified, loadDataStart } = this.props;
    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;
    if (shouldEtoDataLoad) loadDataStart();
  }
  render(): React.ReactNode {
    const {
      companyInformationProgress,
      productVisionProgress,
      etoTermsProgress,
      loadingData,
      etoKeyIndividualsProgress,
      legalInformationProgress,
      kycStatus,
      isEmailVerified,
    } = this.props;

    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;

    return (
      <>
        <Col lg={4} xs={12} sm={6} className="mb-4">
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={etoRegisterRoutes.companyInformation}
            progress={shouldEtoDataLoad ? companyInformationProgress : 0}
            name="Company Information"
          />
        </Col>
        <Col lg={4} xs={12} sm={6} className="mb-4">
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={etoRegisterRoutes.etoTerms}
            progress={shouldEtoDataLoad ? etoTermsProgress : 0}
            name="ETO Terms"
          />
        </Col>
        <Col lg={4} xs={12} sm={6} className="mb-4">
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={etoRegisterRoutes.keyIndividuals}
            progress={shouldEtoDataLoad ? etoKeyIndividualsProgress : 0}
            name="Key Individuals"
          />
        </Col>
        <Col lg={4} xs={12} sm={6} className="mb-4">
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={etoRegisterRoutes.etoTerms}
            progress={shouldEtoDataLoad ? legalInformationProgress : 0}
            name="Legal Information"
          />
        </Col>
        <Col lg={4} xs={12} sm={6} className="mb-4">
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={etoRegisterRoutes.productVision}
            progress={shouldEtoDataLoad ? productVisionProgress : 0}
            name="Product Vision"
          />
        </Col>
        {/* TODO: ADD TRANSLATIONS */}
      </>
    );
  }
}

export const ETOFormsProgressSection = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      companyInformationProgress: selectFormFractionDone(
        EtoCompanyInformationType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      etoTermsProgress: selectFormFractionDone(
        EtoTermsType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      etoKeyIndividualsProgress: selectFormFractionDone(
        EtoKeyIndividualsType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      legalInformationProgress: selectFormFractionDone(
        EtoLegalInformationType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      productVisionProgress: selectFormFractionDone(
        EtoProductVisionType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      loadingData: s.etoFlow.loading,
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
      businessRequestStateLoading: selectWidgetLoading(s.kyc),
    }),
    dispatchToProps: dispatch => ({
      loadDataStart: () => dispatch(actions.etoFlow.loadDataStart()),
    }),
  }),
)(ETOFormsProgressSectionWidget);
