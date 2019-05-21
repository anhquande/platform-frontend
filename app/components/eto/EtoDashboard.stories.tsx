import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { EtoDashboardComponent } from "./EtoDashboard";

// KYC is not filled
const stateStepOne = {
  etoState: EEtoState.PREVIEW,
  shouldViewEtoSettings: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: false,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: false,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: false,
  shouldViewSubmissionSection: false,
};

// Fill in information about your company
const stateStepTwo = {
  ...stateStepOne,
  isVerificationSectionDone: true,
  userHasKycAndEmailVerified: true,
};

// Publish your listing page
const stateStepThree = {
  ...stateStepTwo,
  shouldViewEtoSettings: true,
};

// Publish your listing page
const stateStepThreeFilled = {
  ...stateStepTwo,
  shouldViewEtoSettings: true,
  shouldViewSubmissionSection: true,
};

// Listing page in review
const stateStepFour = {
  ...stateStepThree,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING,
};

const stateStepFourFilled = {
  ...stateStepThreeFilled,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING,
};

// Set up your ETO
const stateStepFive = {
  ...stateStepFour,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBLE,
};

const stateStepFiveFilled = {
  ...stateStepFourFilled,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBLE,
};

const stateStepSix = {
  ...stateStepFiveFilled,
  isTermSheetSubmitted: true,
};

const stateStepSeven = {
  ...stateStepSix,
  etoState: EEtoState.PENDING,
};

const stateStepEight = {
  ...stateStepSix,
  etoState: EEtoState.LISTED,
};

const stateStepEightMemorandum = {
  ...stateStepSix,
  etoState: EEtoState.LISTED,
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
};

const stateStepEightOnChain = {
  ...stateStepEight,
  etoState: EEtoState.ON_CHAIN,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("Step 1 - Verification", () => <EtoDashboardComponent {...stateStepOne} />)
  .add("Step 2 - Company info", () => <EtoDashboardComponent {...stateStepTwo} />)
  .add("Step 3 - Publish listing (ETO not filled)", () => (
    <EtoDashboardComponent {...stateStepThree} />
  ))
  .add("Step 3 - Publish listing (ETO filled)", () => (
    <EtoDashboardComponent {...stateStepThreeFilled} />
  ))
  .add("Step 4 - Publish pending (ETO not filled)", () => (
    <EtoDashboardComponent {...stateStepFour} />
  ))
  .add("Step 4 - Publish pending (ETO filled)", () => (
    <EtoDashboardComponent {...stateStepFourFilled} />
  ))
  .add("Step 5 - Set up ETO (ETO not filled)", () => <EtoDashboardComponent {...stateStepFive} />)
  .add("Step 5 - Set up ETO (ETO filled)", () => <EtoDashboardComponent {...stateStepFiveFilled} />)
  .add("Step 6 - Publish your investment offer", () => <EtoDashboardComponent {...stateStepSix} />)
  .add("Step 7 - Investment offer in review", () => <EtoDashboardComponent {...stateStepSeven} />)
  .add("Step 8 - Campaign is live", () => <EtoDashboardComponent {...stateStepEight} />)
  .add("Step 8 - Campaign is live (Memorandum)", () => (
    <EtoDashboardComponent {...stateStepEightMemorandum} />
  ))
  .add("Step 8 - Campaign is live (On chain)", () => (
    <EtoDashboardComponent {...stateStepEightOnChain} />
  ));
