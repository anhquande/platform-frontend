import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { withProps } from "recompose";
import { compose } from "redux";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectBackupCodesVerified, selectVerifiedUserEmail } from "../../modules/auth/selectors";
import {
  selectCanEnableBookBuilding,
  selectCombinedEtoCompanyData,
  selectIsOfferingDocumentSubmitted,
  selectIssuerEtoIsRetail,
  selectIssuerEtoPreviewCode,
  selectIssuerEtoState,
  selectIsTermSheetSubmitted,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import { calculateGeneralEtoData } from "../../modules/eto-flow/utils";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Container, EColumnSpan } from "../layouts/Container";
import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/settings-widget/SettingsWidgets";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { BookBuildingWidget } from "./dashboard/bookBuildingWidget/BookBuildingWidget";
import { ChooseEtoStartDateWidget } from "./dashboard/chooseEtoStartDateWidget/ChooseEtoStartDateWidget";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { UploadInvestmentAgreement } from "./dashboard/signInvestmentAgreementWidget/UploadInvestmentAgreementWidget.unsafe";
import { SubmitProposalWidget } from "./dashboard/submitProposalWidget/SubmitProposalWidget";
import { UploadInvestmentMemorandum } from "./dashboard/UploadInvestmentMemorandum";
import { UploadProspectusWidget } from "./dashboard/UploadProspectusWidget";
import { UploadTermSheetWidget } from "./dashboard/UploadTermSheetWidget";
import { DashboardHeading } from "./shared/DashboardHeading";
import { EProjectStatusLayout, EProjectStatusSize, ETOState } from "./shared/ETOState";

const SUBMIT_PROPOSAL_THRESHOLD = 1;

interface IStateProps {
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  isLightWallet: boolean;
  shouldEtoDataLoad?: boolean;
  requestStatus?: ERequestStatus;
  etoState?: EEtoState;
  previewCode?: string;
  canEnableBookbuilding: boolean;
  etoFormProgress?: number;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  isRetailEto: boolean;
}

interface IComputedProps {
  isVerificationSectionDone: boolean;
  shouldViewSubmissionSection: boolean;
}

interface IDispatchProps {
  loadFileDataStart: () => void;
}

const SubmitDashBoardSection: React.FunctionComponent<{
  isTermSheetSubmitted?: boolean;
  columnSpan?: EColumnSpan;
}> = ({ isTermSheetSubmitted, columnSpan }) => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardHeading
        step={3}
        title="UPLOAD FILES / SUBMIT PROPOSAL"
        data-test-id="eto-dashboard-verification"
      />
    </Container>
    {isTermSheetSubmitted ? (
      <SubmitProposalWidget columnSpan={columnSpan} />
    ) : (
      <UploadTermSheetWidget columnSpan={columnSpan} />
    )}
  </>
);

const EtoProgressDashboardSection: React.FunctionComponent = () => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardHeading step={2} title="ETO APPLICATION" />
      <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
    </Container>
    <ETOFormsProgressSection />
  </>
);

interface IEtoStateRender {
  etoState?: EEtoState;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  canEnableBookbuilding: boolean;
  previewCode?: string;
  isRetailEto: boolean;
}

const EtoDashboardStateViewComponent: React.FunctionComponent<IEtoStateRender> = ({
  etoState,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isOfferingDocumentSubmitted,
  canEnableBookbuilding,
  previewCode,
  isRetailEto,
}) => {
  if (!previewCode) {
    return (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator />
      </Container>
    );
  }
  const dashboardTitle = (
    <ETOState
      previewCode={previewCode}
      size={EProjectStatusSize.LARGE}
      layout={EProjectStatusLayout.BLACK}
    />
  );
  switch (etoState) {
    case EEtoState.PREVIEW:
      return (
        <>
          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection
              isTermSheetSubmitted={isTermSheetSubmitted}
              columnSpan={EColumnSpan.TWO_COL}
            />
          )}
          <EtoProgressDashboardSection />
        </>
      );
    case EEtoState.PENDING:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.LISTED:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          {!isOfferingDocumentSubmitted &&
            (isRetailEto ? (
              <UploadProspectusWidget columnSpan={EColumnSpan.ONE_COL} />
            ) : (
              <UploadInvestmentMemorandum columnSpan={EColumnSpan.ONE_COL} />
            ))}
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
          </Container>
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.PROSPECTUS_APPROVED:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
          </Container>
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          <UploadInvestmentAgreement columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ChooseEtoStartDateWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Container>
          <ETOFormsProgressSection />
        </>
      );
    default:
      return (
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardHeading title={dashboardTitle} />
        </Container>
      );
  }
};

class EtoDashboardComponent extends React.Component<IStateProps & IComputedProps & IDispatchProps> {
  render(): React.ReactNode {
    const {
      etoState,
      canEnableBookbuilding,
      shouldViewSubmissionSection,
      isTermSheetSubmitted,
      isOfferingDocumentSubmitted,
      previewCode,
      isRetailEto,
      isVerificationSectionDone,
    } = this.props;

    return (
      <WidgetGridLayout data-test-id="eto-dashboard-application">
        {!isVerificationSectionDone && (
          <>
            <Container>
              <DashboardHeading
                step={1}
                title="VERIFICATION"
                data-test-id="eto-dashboard-verification"
              />
            </Container>
            <SettingsWidgets
              isDynamic={true}
              {...this.props}
              columnSpan={EColumnSpan.ONE_AND_HALF_COL}
            />
          </>
        )}
        <EtoDashboardStateViewComponent
          isTermSheetSubmitted={isTermSheetSubmitted}
          isOfferingDocumentSubmitted={isOfferingDocumentSubmitted}
          shouldViewSubmissionSection={shouldViewSubmissionSection}
          etoState={etoState}
          canEnableBookbuilding={canEnableBookbuilding}
          previewCode={previewCode}
          isRetailEto={isRetailEto}
        />
      </WidgetGridLayout>
    );
  }
}

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: d => d(actions.etoFlow.loadIssuerEto()),
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s),
      isLightWallet: selectIsLightWallet(s.web3),
      shouldEtoDataLoad: selectShouldEtoDataLoad(s),
      requestStatus: selectKycRequestStatus(s),
      etoState: selectIssuerEtoState(s),
      previewCode: selectIssuerEtoPreviewCode(s),
      canEnableBookbuilding: selectCanEnableBookBuilding(s),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s),
      isOfferingDocumentSubmitted: selectIsOfferingDocumentSubmitted(s),
      etoFormProgress: calculateGeneralEtoData(selectCombinedEtoCompanyData(s)),
      isRetailEto: selectIssuerEtoIsRetail(s),
    }),
    dispatchToProps: dispatch => ({
      loadFileDataStart: () => dispatch(actions.etoDocuments.loadFileDataStart()),
    }),
  }),
  withProps<IComputedProps, IStateProps>(props => ({
    isVerificationSectionDone: Boolean(
      props.verifiedEmail &&
        props.backupCodesVerified &&
        props.requestStatus === ERequestStatus.ACCEPTED,
    ),
    shouldViewSubmissionSection: Boolean(
      props.etoFormProgress && props.etoFormProgress >= SUBMIT_PROPOSAL_THRESHOLD,
    ),
  })),
  onEnterAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.shouldEtoDataLoad) {
        dispatch(actions.kyc.kycLoadIndividualDocumentList());
      }
      if (props.shouldEtoDataLoad) {
        dispatch(actions.etoDocuments.loadFileDataStart());
      }
    },
  }),
  withContainer(LayoutAuthorized),
)(EtoDashboardComponent);

export { EtoDashboard, EtoDashboardComponent, EtoDashboardStateViewComponent };
