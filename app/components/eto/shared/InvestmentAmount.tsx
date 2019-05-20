import * as React from "react";

import { getInvestmentAmount } from "../../../lib/api/eto/EtoUtils";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { MoneyRange } from "../../shared/formatters/MoneyRange";
import { ECurrency, EHumanReadableFormat, EMoneyInputFormat } from "../../shared/formatters/utils";
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
      inputFormat={EMoneyInputFormat.FLOAT}
      moneyFormat={ECurrency.EUR}
      outputFormat={EHumanReadableFormat.SHORT}
      defaultValue={<ToBeAnnounced />}
    />
  );
};

export { InvestmentAmount };
