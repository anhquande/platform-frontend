import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ECurrency, EMoneyInputFormat } from "../../../../shared/formatters/utils";
import { ECurrencySymbol, Money } from "../../../../shared/Money.unsafe";
import { WhitelistProgress } from "./WhitelistProgress";

import * as styles from "./WhitelistStatus.module.scss";

export interface IInvestmentWidgetProps {
  investorsCount: number;
  investorsLimit: number;
  pledgedAmount: number | null;
}

const WhitelistStatus: React.FunctionComponent<IInvestmentWidgetProps> = ({
  investorsCount,
  investorsLimit,
  pledgedAmount,
}) => (
  <div className={styles.investmentWidget}>
    <div className={styles.header}>
      <div>
        <FormattedMessage
          id="eto-overview-thumbnail.whitelist.amount-signed-up"
          values={{
            amount: (
              <Money
                value={pledgedAmount}
                currency={ECurrency.EUR}
                format={EMoneyInputFormat.FLOAT}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
            ),
          }}
        />
      </div>
      <div>
        <FormattedMessage
          id="eto-overview-thumbnail.whitelist.slots-left"
          values={{
            left: (
              <span data-test-id="eto-bookbuilding-remaining-slots">
                {investorsLimit - investorsCount}
              </span>
            ),
            limit: investorsLimit,
          }}
        />
      </div>
    </div>
    <WhitelistProgress investorsLimit={investorsLimit} investorsCount={investorsCount} />
  </div>
);

export { WhitelistStatus };
