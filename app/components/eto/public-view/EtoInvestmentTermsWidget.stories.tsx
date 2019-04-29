import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../test/fixtures";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { EtoInvestmentTermsWidgetLayout } from "./EtoInvestmentTermsWidget";

const eto: TEtoWithCompanyAndContract = {
  ...testEto,
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
};

storiesOf("ETO/EtoInvestmentTermsWidget", module).add("default", () => (
  <EtoInvestmentTermsWidgetLayout etoData={eto} downloadDocument={() => {}} />
));
