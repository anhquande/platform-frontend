import * as React from "react";

import { getInvestmentAmount } from "../../../lib/api/eto/EtoUtils";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { MoneyRange } from "../../shared/formatters/MoneyRange";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
} from "../../shared/formatters/utils";
import { ToBeAnnounced } from "./ToBeAnnouncedTooltip";

type TExternalProps = {
  etoData: TEtoWithCompanyAndContract;
};

const InvestmentAmount: React.FunctionComponent<TExternalProps> = ({ etoData }) => {
  const { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount(etoData);

  return (
    <MoneyRange
      valueFrom={minInvestmentAmount}
      valueUpto={maxInvestmentAmount}
      inputFormat={ENumberInputFormat.FLOAT}
      moneyFormat={ECurrency.EUR}
      outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
      defaultValue={<ToBeAnnounced />}
    />
  );
};

export { InvestmentAmount };
