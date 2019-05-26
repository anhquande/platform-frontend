import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../../modules/tx/types";
import { ECurrency, ENumberOutputFormat, ERoundingMode } from "../../../shared/formatters/utils";
import { EtherscanAddressLink } from "../../../shared/links/EtherscanLink";
import { MoneySuiteWidget } from "../../../shared/MoneySuiteWidget";
import { TransactionDetailsComponent } from "../types";

import * as styles from "./Withdraw.module.scss";

const WithdrawTransactionDetails: TransactionDetailsComponent<ETxSenderType.WITHDRAW> = ({
  additionalData,
}) => (
  <>
    <section className={styles.section}>
      <FormattedMessage id="modal.sent-eth.transfer-from" />
      <div className={cn(styles.withEtherscan, "text-right")}>
        <span className={styles.walletLabel}>
          <FormattedMessage id="modal.sent-eth.ether-balance" />
        </span>
        <EtherscanAddressLink className={"small"} address={additionalData.walletAddress}>
          <FormattedMessage id="modal.sent-eth.view-on-etherscan" />
        </EtherscanAddressLink>
      </div>
    </section>

    <section className={cn(styles.section, "flex-nowrap")}>
      <FormattedMessage id="modal.sent-eth.to-address" />
      <div className={cn(styles.withEtherscan, "text-right")}>
        <span
          className={cn(
            styles.walletLabel,
            "text-truncate",
            "d-inline-block",
            "w-75",
            "align-self-end",
          )}
          data-test-id="modals.tx-sender.withdraw-flow.summary.to"
        >
          {additionalData.to}
        </span>
        <EtherscanAddressLink className={"small"} address={additionalData.to}>
          <FormattedMessage id="modal.sent-eth.view-on-etherscan" />
        </EtherscanAddressLink>
      </div>
    </section>

    <hr />

    <section className={styles.section}>
      <FormattedMessage id="modal.sent-eth.amount" />
      <MoneySuiteWidget
        data-test-id="modals.tx-sender.withdraw-flow.summary.value"
        currency={ECurrency.ETH}
        currencyTotal={ECurrency.EUR}
        largeNumber={additionalData.amount}
        value={additionalData.amountEur}
        theme={"green"}
      />
    </section>

    <section className={styles.section}>
      <div className={styles.withEtherscan}>
        <FormattedMessage id="modal.sent-eth.transaction-fee" />
        <small>
          <FormattedMessage id="modal.sent-eth.gas" />
        </small>
      </div>
      <MoneySuiteWidget
        data-test-id="modals.tx-sender.withdraw-flow.summary.cost"
        currency={ECurrency.ETH}
        currencyTotal={ECurrency.EUR}
        largeNumber={additionalData.cost}
        value={additionalData.costEur}
        theme={"green"}
        outputFormat={ENumberOutputFormat.FULL}
        roundingMode={ERoundingMode.UP}
      />
    </section>

    <hr />

    <section className={styles.section}>
      <FormattedMessage id="modal.sent-eth.amount" />
      <MoneySuiteWidget
        currency={ECurrency.ETH}
        currencyTotal={ECurrency.EUR}
        largeNumber={additionalData.total}
        value={additionalData.totalEur}
        theme={"green"}
      />
    </section>
  </>
);

export { WithdrawTransactionDetails };
