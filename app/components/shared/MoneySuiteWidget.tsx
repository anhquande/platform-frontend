import * as cn from "classnames";
import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { makeTid } from "../../utils/tidUtils";
import { MoneyNew } from "./formatters/Money";
import { ECurrency, ENumberInputFormat, ENumberOutputFormat } from "./formatters/utils";

import * as styles from "./MoneySuiteWidget.module.scss";

export type TTheme = "light" | "framed";
export type TSize = "large";

export interface IMoneySuiteWidgetProps {
  icon: string;
  currency: ECurrency;
  currencyTotal: ECurrency;
  largeNumber: string;
  value: string;
  percentage?: string;
  theme?: TTheme;
  size?: TSize;
  walletName?: TTranslatedString;
}

export const MoneySuiteWidget: React.FunctionComponent<IMoneySuiteWidgetProps & TDataTestId> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  value,
  percentage,
  "data-test-id": dataTestId,
  theme,
  size,
  walletName,
}) => (
  <div className={cn(styles.moneySuiteWidget, theme, size)}>
    <div>
      <img className={styles.icon} src={icon} alt="" />
      {walletName}
    </div>
    <div>
      <div className={styles.money} data-test-id={makeTid(dataTestId, "large-value")}>
        <MoneyNew
          value={largeNumber}
          inputFormat={ENumberInputFormat.ULPS}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          moneyFormat={currency}
        />
      </div>
      <div className={styles.totalMoney} data-test-id={makeTid(dataTestId, "value")}>
        ={" "}
        <MoneyNew
          value={value}
          inputFormat={ENumberInputFormat.ULPS}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          moneyFormat={currencyTotal}
        />
        {percentage && (
          <span className={`${parseInt(percentage, 10) > 0 ? styles.green : styles.red}`}>
            {" "}
            ({percentage}
            %)
          </span>
        )}
      </div>
    </div>
  </div>
);
