import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { selectEtoOnChainNextStateStartDate } from "../../../../../modules/eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../../modules/eto/types";
import { appConnect } from "../../../../../store";
import { FormatNumber } from "../../../../shared/formatters/FormatNumber";
import { MoneyNew } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
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
  const totalInvestors = eto.contract!.totalInvestment.totalInvestors;

  return (
    <div className={styles.investmentWidget}>
      <div className={styles.header}>
        {eto.contract!.timedState !== EETOStateOnChain.Payout && (
          <div>
            <MoneyNew
              value={eto.contract!.totalInvestment.etherTokenBalance}
              inputFormat={ENumberInputFormat.ULPS}
              moneyFormat={ECurrency.ETH}
              outputFormat={ENumberOutputFormat.FULL}
            />
            <br />
            <MoneyNew
              value={eto.contract!.totalInvestment.euroTokenBalance}
              inputFormat={ENumberInputFormat.ULPS}
              moneyFormat={ECurrency.EUR_TOKEN}
              outputFormat={ENumberOutputFormat.FULL}
            />
          </div>
        )}
        {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && (
          <div>
            <FormattedMessage
              id="shared-component.eto-overview.investors"
              values={{
                totalInvestors: (
                  <FormatNumber
                    value={totalInvestors}
                    outputFormat={ENumberOutputFormat.INTEGER}
                    inputFormat={ENumberInputFormat.FLOAT}
                  />
                ),
              }}
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
