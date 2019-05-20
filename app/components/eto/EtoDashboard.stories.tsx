import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { EtoDashboardComponent } from "./EtoDashboard";

const statePreview = {
  etoState: EEtoState.PREVIEW,
  shouldViewEtoSettings: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
  shouldViewSubmissionSection: true,
};

const statePreviewNoSubmissionSection = {
  etoState: EEtoState.PREVIEW,
  shouldViewEtoSettings: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const statePreviewWithPreviewSubmissionWithoutMarketingVisible = {
  ...statePreviewNoSubmissionSection,
  shouldViewEtoSettings: true,
};

const statePending = {
  etoState: EEtoState.PENDING,
  shouldViewEtoSettings: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateListed_1 = {
  etoState: EEtoState.LISTED,
  shouldViewEtoSettings: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateListed_2 = {
  etoState: EEtoState.LISTED,
  shouldViewEtoSettings: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateListed_3 = {
  etoState: EEtoState.LISTED,
  shouldViewEtoSettings: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateProspectusApproved_1 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewEtoSettings: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateProspectusApproved_2 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewEtoSettings: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateOnChainWhitelist = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewEtoSettings: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateOnChainSigning = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewEtoSettings: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateOnChainRefund = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewEtoSettings: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

const stateOnChainClaim = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewEtoSettings: true,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isVerificationSectionDone: true,
  isLightWallet: true,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: true,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))

  .add("State PREVIEW with submissionSection", () => <EtoDashboardComponent {...statePreview} />)
  .add("State PREVIEW with preview submission without marketing data visible", () => (
    <EtoDashboardComponent {...statePreviewWithPreviewSubmissionWithoutMarketingVisible} />
  ))
  .add("State PREVIEW, no submissionSection", () => (
    <EtoDashboardComponent {...statePreviewNoSubmissionSection} />
  ))
  .add("State PENDING", () => <EtoDashboardComponent {...statePending} />)
  .add("State LISTED, retail eto, canEnableBookbuilding, eto submitted ", () => (
    <EtoDashboardComponent {...stateListed_1} />
  ))
  .add("State LISTED, retail eto, eto not submitted", () => (
    <EtoDashboardComponent {...stateListed_2} />
  ))
  .add("State LISTED, canEnableBookbuilding, eto not submitted", () => (
    <EtoDashboardComponent {...stateListed_3} />
  ))
  .add("State PROSPECTUS_APPROVED", () => <EtoDashboardComponent {...stateProspectusApproved_1} />)
  .add("State PROSPECTUS_APPROVED, canEnableBookbuilding", () => (
    <EtoDashboardComponent {...stateProspectusApproved_2} />
  ))
  .add("State OnChain whitelist", () => <EtoDashboardComponent {...stateOnChainWhitelist} />)
  .add("State OnChain Signing", () => <EtoDashboardComponent {...stateOnChainSigning} />)
  .add("State OnChain claim", () => <EtoDashboardComponent {...stateOnChainClaim} />)
  .add("State OnChain refund", () => <EtoDashboardComponent {...stateOnChainRefund} />);
