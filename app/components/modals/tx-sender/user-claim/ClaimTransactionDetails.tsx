import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../../modules/tx/types";
import { ECurrency } from "../../../shared/formatters/utils";
import { ECurrencySymbol, Money } from "../../../shared/Money.unsafe";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const ClaimTransactionDetails: TransactionDetailsComponent<ETxSenderType.USER_CLAIM> = ({
  txTimestamp,
  additionalData,
  className,
  children,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.token-name" />}
      value={additionalData.tokenName}
    />

    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.balance" />}
      value={additionalData.tokenQuantity}
    />

    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.estimated-reward" />}
      value={
        <Money
          value={additionalData.neuRewardUlps}
          currency={ECurrency.NEU}
          currencySymbol={ECurrencySymbol.NONE}
        />
      }
    />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
      value={<Money currency={ECurrency.ETH} value={additionalData.costUlps} />}
    />

    {children}

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { ClaimTransactionDetails };
