import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { IPanelProps, Panel } from "../../shared/Panel";
import { TotalEuro } from "../TotalEuro";

import * as styles from "./WalletBalance.module.scss";

export interface IWalletValues {
  ethAmount: string;
  ethEuroAmount: string;
  neuroAmount: string;
  neuroEuroAmount: string;
  totalEuroAmount: string;
}

export const LoadingWallet: React.FunctionComponent<IPanelProps> = props => (
  <WalletBalanceContainer {...props}>
    <LoadingIndicator />
  </WalletBalanceContainer>
);

export const WalletBalanceContainer: React.FunctionComponent<
  IPanelProps &
    CommonHtmlProps & {
      data?: IWalletValues;
    }
> = ({ headerText, data, className, children, columnSpan }) => (
  <Panel
    headerText={headerText}
    rightComponent={data && <TotalEuro totalEurValue={data.totalEuroAmount} />}
    className={cn(className, "d-flex flex-column")}
    columnSpan={columnSpan}
  >
    <div className={styles.wrapper}>{children}</div>
  </Panel>
);
