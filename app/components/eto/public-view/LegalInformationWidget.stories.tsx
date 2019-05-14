import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testCompany } from "../../../../test/fixtures";
import { LegalInformationWidget } from "./LegalInformationWidget";

const emptyShareholders = {
  ...testCompany,
  shareholders: undefined,
};

storiesOf("ETO/PublicView/LegalInformationWidget", module)
  .add("default", () => <LegalInformationWidget companyData={testCompany} />)
  .add("empty shareholders", () => <LegalInformationWidget companyData={emptyShareholders} />);
