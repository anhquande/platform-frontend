import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { EtoDashboardComponent } from "./EtoDashboard";

const statePreview = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const statePreviewNoSubmissionSection = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const statePending = {
  etoState: EEtoState.PENDING,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateListed_1 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateListed_2 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateListed_3 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: false,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateProspectusApproved_1 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateProspectusApproved_2 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateOnChainWhitelist = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateOnChainSigning = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateOnChainRefund = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isLightWallet: true,
  isVerificationSectionDone: true,
  loadFileDataStart: action("loadFileDataStart"),
};

const stateOnChainClaim = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true,
  isLightWallet: true,
  loadFileDataStart: action("loadFileDataStart"),
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))

  .add("State PREVIEW with submissionSection", () => <EtoDashboardComponent {...statePreview} />)
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
