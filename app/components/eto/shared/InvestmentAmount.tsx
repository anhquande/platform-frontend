import * as React from "react";

import { getInvestmentAmount } from "../../../lib/api/eto/EtoUtils";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { ECurrency, EMoneyInputFormat } from "../../shared/formatters/utils";
import { ECurrencySymbol, Money } from "../../shared/Money.unsafe";
import { ToHumanReadableForm } from "../../shared/ToHumanReadableForm";

type TExternalProps = {
  etoData: TEtoWithCompanyAndContract;
};

const InvestmentAmount: React.FunctionComponent<TExternalProps> = ({ etoData }) => {
  const { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount(etoData);

  const value = (
    <ToHumanReadableForm number={minInvestmentAmount}>
      {divider => <ToHumanReadableForm number={maxInvestmentAmount} divider={divider} />}
    </ToHumanReadableForm>
  );

  return (
    <Money
      format={EMoneyInputFormat.FLOAT}
      currencySymbol={ECurrencySymbol.SYMBOL}
      currency={ECurrency.EUR}
      value={value}
    />
  );
};

export { InvestmentAmount };
