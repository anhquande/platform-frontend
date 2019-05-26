import * as cn from "classnames";
import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { makeTid } from "../../utils/tidUtils";
import { MoneyNew } from "./formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  THumanReadableFormat,
} from "./formatters/utils";

import * as styles from "./MoneySuiteWidget.module.scss";

export type TTheme = "light" | "framed" | "green" | "orange";
export type TSize = "large";

export interface IMoneySuiteWidgetProps {
  icon?: string;
  currency: ECurrency;
  currencyTotal: ECurrency;
  largeNumber: string;
  value: string;
  percentage?: string;
  theme?: TTheme;
  size?: TSize;
  walletName?: TTranslatedString;
  outputFormat?: THumanReadableFormat;
  roundingMode?: ERoundingMode;
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
  outputFormat,
  roundingMode,
}) => (
  <div className={cn(styles.moneySuiteWidget, theme, size)}>
    {icon && (
      <div>
        <img className={styles.icon} src={icon} alt="" />
        {walletName}
      </div>
    )}
    <div>
      <div
        className={cn(styles.money, "text-right")}
        data-test-id={makeTid(dataTestId, "large-value")}
      >
        <MoneyNew
          value={largeNumber}
          inputFormat={ENumberInputFormat.ULPS}
          outputFormat={outputFormat!}
          moneyFormat={currency}
          roundingMode={roundingMode}
        />
      </div>
      <div
        className={cn(styles.totalMoney, "text-right")}
        data-test-id={makeTid(dataTestId, "value")}
      >
        ={" "}
        <MoneyNew
          value={value}
          inputFormat={ENumberInputFormat.ULPS}
          outputFormat={outputFormat!}
          moneyFormat={currencyTotal}
          roundingMode={roundingMode}
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

MoneySuiteWidget.defaultProps = {
  outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
};
