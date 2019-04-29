import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { selectEtoOnChainNextStateStartDate } from "../../../../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../../../modules/eto/types";
import { appConnect } from "../../../../../store";
import { ECurrency, Money } from "../../../../shared/Money.unsafe";
import { InvestmentProgress } from "./InvestmentProgress";

import * as styles from "./InvestmentStatus.module.scss";

export interface IInvestmentWidgetProps {
  eto: TEtoWithCompanyAndContract;
}

export interface IInvestmentWidgetStateProps {
  nextStateDate: Date | undefined;
}

export type TInvestWidgetProps = IInvestmentWidgetProps & IInvestmentWidgetStateProps;

const InvestmentLayout: React.FunctionComponent<TInvestWidgetProps> = ({ eto }) => {
  const totalInvestors = eto.contract!.totalInvestment.totalInvestors.toNumber();

  return (
    <div className={styles.investmentWidget}>
      <div className={styles.header}>
        <div>
          <Money value={eto.contract!.totalInvestment.etherTokenBalance} currency={ECurrency.ETH} />
          <br />
          <Money
            value={eto.contract!.totalInvestment.euroTokenBalance}
            currency={ECurrency.EUR_TOKEN}
          />
        </div>
        {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && (
          <div>
            <FormattedMessage
              id="shared-component.eto-overview.investors"
              values={{ totalInvestors }}
            />
          </div>
        )}
      </div>
      <InvestmentProgress eto={eto} />
    </div>
  );
};

const InvestmentStatus = compose<TInvestWidgetProps, IInvestmentWidgetProps>(
  appConnect<IInvestmentWidgetStateProps, {}, IInvestmentWidgetProps>({
    stateToProps: (state, props) => ({
      nextStateDate: selectEtoOnChainNextStateStartDate(state, props.eto.previewCode),
    }),
  }),
)(InvestmentLayout);

export { InvestmentStatus };
