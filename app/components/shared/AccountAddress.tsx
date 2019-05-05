import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TDataTestId } from "../../types";
import { Avatar } from "./Avatar";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { EtherscanAddressLink } from "./links";

import * as styles from "./AccountAddress.module.scss";

export interface IAccountAddressProps {
  address: string;
}

const AccountAddress: React.FunctionComponent<
  IAccountAddressProps & CommonHtmlProps & TDataTestId
> = ({
  address,
  className,
  "data-test-id": dataTestId = "account-address.your.ether-address.from-div",
}) => (
  <div className={cn(styles.accountAddress, className)}>
    <Avatar seed={address} />

    <div className={styles.addressWrapper}>
      <div className={styles.address} data-test-id={dataTestId}>
        {address}
      </div>
      <div className={styles.transactionHistory}>
        <FormattedMessage id="shared-components.account-address.transaction-history" />{" "}
        <EtherscanAddressLink address={address} />
      </div>
    </div>

    <CopyToClipboardButton value={address} />
  </div>
);

export { AccountAddress };
