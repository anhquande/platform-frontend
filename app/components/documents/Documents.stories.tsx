import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { etoDocuments, etoFilesData, etoTemplates } from "../../../test/fixtures";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EETOStateOnChain } from "../../modules/eto/types";
import { DocumentsLayout } from "./Documents";

const props: React.ComponentProps<typeof DocumentsLayout> = {
  isLoading: false,
  shouldEtoDataLoad: true,
  etoFilesData: etoFilesData,
  etoState: EEtoState.ON_CHAIN,
  etoTemplates: etoTemplates,
  etoDocuments: etoDocuments,
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
  generateTemplate: action("generateTemplate"),
  startDocumentDownload: action("startDocumentDownload"),
  onChainState: EETOStateOnChain.Signing,
  documentsDownloading: {},
  documentsUploading: {},
  documentsGenerated: {},
  transactionPending: false,
};

storiesOf("ETO/Documents", module).add("default", () => <DocumentsLayout {...props} />);
