import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testCompany } from "../../../../test/fixtures";
import { LegalInformationWidget } from "./LegalInformationWidget";

const emptyShareholders = {
  ...testCompany,
  shareholders: undefined,
};

const moreThanSix = {
  ...testCompany,
  shareholders: Array(12).fill({
    fullName: "The same, but different",
    shares: 10000,
  }),
};

storiesOf("ETO/PublicView/LegalInformationWidget", module)
  .add("default", () => <LegalInformationWidget companyData={testCompany} />)
  .add("empty shareholders", () => <LegalInformationWidget companyData={emptyShareholders} />)
  .add("more than 6 shareholders", () => <LegalInformationWidget companyData={moreThanSix} />);
