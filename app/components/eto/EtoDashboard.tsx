import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { lifecycle, withProps } from "recompose";
import { compose } from "redux";

import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectBackupCodesVerified, selectVerifiedUserEmail } from "../../modules/auth/selectors";
import {
  selectCanEnableBookBuilding,
  selectCombinedEtoCompanyData,
  selectIsMarketingDataVisibleInPreview,
  selectIsOfferingDocumentSubmitted,
  selectIssuerEtoOfferingDocumentType,
  selectIssuerEtoPreviewCode,
  selectIssuerEtoState,
  selectIsTermSheetSubmitted,
  userHasKycAndEmailVerified,
} from "../../modules/eto-flow/selectors";
import { calculateMarketingEtoData, calculateSettingsEtoData } from "../../modules/eto-flow/utils";
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
import { PublishETOWidget } from "./dashboard/PublishETOWidget";
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
  backupCodesVerified: boolean;
  isLightWallet: boolean;
  userHasKycAndEmailVerified: boolean;
  requestStatus?: ERequestStatus;
  etoState?: EEtoState;
  previewCode?: string;
  canEnableBookbuilding: boolean;
  marketingFormsProgress?: number;
  etoSettingsFormsProgress?: number;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
}

interface ISubmissionProps {
  shouldViewEtoSettings?: boolean;
  shouldViewSubmissionSection?: boolean;
}

interface IComputedProps extends ISubmissionProps {
  isVerificationSectionDone: boolean;
}

interface IComponentProps extends ISubmissionProps {
  verifiedEmail?: string;
  isLightWallet: boolean;
  userHasKycAndEmailVerified: boolean;
  requestStatus?: ERequestStatus;
  etoState?: EEtoState;
  previewCode?: string;
  canEnableBookbuilding: boolean;
  etoFormProgress?: number;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isVerificationSectionDone: boolean;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
}

interface IDispatchProps {
  initEtoView: () => void;
}

const SubmitDashBoardSection: React.FunctionComponent<{
  isTermSheetSubmitted?: boolean;
  columnSpan?: EColumnSpan;
}> = ({ isTermSheetSubmitted, columnSpan }) => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardHeading
        step={3}
        title="UPLOAD TERM SHEET AND PUBLISH YOUR ETO LISTING PAGE"
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

const EtoProgressDashboardSection: React.FunctionComponent<ISubmissionProps> = ({
  shouldViewEtoSettings,
}) => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
      <DashboardHeading step={2} title="SETUP YOUR ETO" />
    </Container>
    <ETOFormsProgressSection shouldViewEtoSettings={shouldViewEtoSettings} />
  </>
);

interface IEtoStateRender {
  etoState?: EEtoState;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  canEnableBookbuilding: boolean;
  previewCode?: string;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
  shouldViewEtoSettings?: boolean;
}

const EtoDashboardStateViewComponent: React.FunctionComponent<IEtoStateRender> = ({
  etoState,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isOfferingDocumentSubmitted,
  canEnableBookbuilding,
  previewCode,
  offeringDocumentType,
  isMarketingDataVisibleInPreview,
  shouldViewEtoSettings,
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
          {shouldViewEtoSettings &&
            isMarketingDataVisibleInPreview !== EEtoMarketingDataVisibleInPreview.VISIBLE && (
              <PublishETOWidget isMarketingDataVisibleInPreview={isMarketingDataVisibleInPreview} />
            )}
          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection
              isTermSheetSubmitted={isTermSheetSubmitted}
              columnSpan={EColumnSpan.TWO_COL}
            />
          )}
          <EtoProgressDashboardSection shouldViewEtoSettings={shouldViewEtoSettings} />
        </>
      );
    case EEtoState.PENDING:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
            <FormattedHTMLMessage
              tagName="p"
              id="shared-component.eto-overview.status-in-review.review-message"
            />
          </Container>
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.LISTED:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
          </Container>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          {!isOfferingDocumentSubmitted &&
            (offeringDocumentType === EOfferingDocumentType.PROSPECTUS ? (
              <UploadProspectusWidget columnSpan={EColumnSpan.ONE_COL} />
            ) : (
              <UploadInvestmentMemorandum columnSpan={EColumnSpan.ONE_COL} />
            ))}
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
          </Container>
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.PROSPECTUS_APPROVED:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="p" id="eto-dashboard-application-description" />
          </Container>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Container>
          <Container columnSpan={EColumnSpan.THREE_COL}>
            <DashboardHeading title={dashboardTitle} />
          </Container>
          <UploadInvestmentAgreement columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ChooseEtoStartDateWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
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

class EtoDashboardComponent extends React.Component<IComponentProps> {
  render(): React.ReactNode {
    const {
      etoState,
      canEnableBookbuilding,
      shouldViewEtoSettings,
      isTermSheetSubmitted,
      isOfferingDocumentSubmitted,
      previewCode,
      offeringDocumentType,
      isVerificationSectionDone,
      userHasKycAndEmailVerified,
      isMarketingDataVisibleInPreview,
      shouldViewSubmissionSection,
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
        {userHasKycAndEmailVerified && (
          <EtoDashboardStateViewComponent
            isTermSheetSubmitted={isTermSheetSubmitted}
            isOfferingDocumentSubmitted={isOfferingDocumentSubmitted}
            shouldViewEtoSettings={shouldViewEtoSettings}
            shouldViewSubmissionSection={shouldViewSubmissionSection}
            etoState={etoState}
            canEnableBookbuilding={canEnableBookbuilding}
            previewCode={previewCode}
            offeringDocumentType={offeringDocumentType}
            isMarketingDataVisibleInPreview={isMarketingDataVisibleInPreview}
          />
        )}
      </WidgetGridLayout>
    );
  }
}

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s),
      isLightWallet: selectIsLightWallet(s.web3),
      userHasKycAndEmailVerified: userHasKycAndEmailVerified(s),
      requestStatus: selectKycRequestStatus(s),
      etoState: selectIssuerEtoState(s),
      previewCode: selectIssuerEtoPreviewCode(s),
      canEnableBookbuilding: selectCanEnableBookBuilding(s),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s),
      isOfferingDocumentSubmitted: selectIsOfferingDocumentSubmitted(s),
      marketingFormsProgress: calculateMarketingEtoData(selectCombinedEtoCompanyData(s)),
      etoSettingsFormsProgress: calculateSettingsEtoData(selectCombinedEtoCompanyData(s)),
      offeringDocumentType: selectIssuerEtoOfferingDocumentType(s),
      isMarketingDataVisibleInPreview: selectIsMarketingDataVisibleInPreview(s),
    }),
    dispatchToProps: dispatch => ({
      initEtoView: () => {
        dispatch(actions.etoFlow.loadIssuerEto());
        dispatch(actions.kyc.kycLoadIndividualDocumentList());
        dispatch(actions.etoDocuments.loadFileDataStart());
      },
    }),
  }),
  withProps<IComputedProps, IStateProps>(props => ({
    isVerificationSectionDone: props.userHasKycAndEmailVerified && props.backupCodesVerified,
    shouldViewEtoSettings: Boolean(
      props.marketingFormsProgress && props.marketingFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD,
    ),
    shouldViewSubmissionSection: Boolean(
      props.etoSettingsFormsProgress && props.etoSettingsFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD,
    ),
  })),
  onEnterAction<IStateProps & IDispatchProps>({
    actionCreator: (_, props) => {
      if (props.userHasKycAndEmailVerified) {
        props.initEtoView();
      }
    },
  }),
  lifecycle<IStateProps & IDispatchProps, {}>({
    componentDidUpdate(nextProps: IStateProps & IDispatchProps): void {
      if (this.props.userHasKycAndEmailVerified !== nextProps.userHasKycAndEmailVerified) {
        this.props.initEtoView();
      }
    },
  }),
  withContainer(LayoutAuthorized),
)(EtoDashboardComponent);

export { EtoDashboard, EtoDashboardComponent, EtoDashboardStateViewComponent };
