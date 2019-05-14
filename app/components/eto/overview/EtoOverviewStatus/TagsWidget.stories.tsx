import { storiesOf } from "@storybook/react";
import * as React from "react";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import {
  EJurisdiction,
  EOfferingDocumentType,
} from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { TagsWidgetLayout } from "./TagsWidget";

const defaultProps = {
  etoId: "1234",
  downloadDocument: () => {},
  termSheet: {} as IEtoDocument,
  prospectusApproved: {} as IEtoDocument,
  smartContractOnChain: true,
  jurisdiction: EJurisdiction.GERMANY,
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
};

storiesOf("ETO/TagsWidget", module)
  .add("default", () => <TagsWidgetLayout {...defaultProps} />)
  .add("retailEto", () => (
    <TagsWidgetLayout {...defaultProps} offeringDocumentType={EOfferingDocumentType.MEMORANDUM} />
  ));
