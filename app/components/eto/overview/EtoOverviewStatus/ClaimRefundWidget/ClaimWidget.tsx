import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";
import { ECurrency, ECurrencySymbol, Money } from "../../../../shared/Money.unsafe";
import { Message } from "../Message";
import { withCanClaimToken } from "./withCanClaimToken";

interface IExternalProps {
  tokenName: string;
  totalInvestors: number | undefined;
  totalEquivEurUlps: BigNumber;
  canClaimToken: boolean;
  etoId: string;
  onClaim: (etoId: string) => void;
}

const ClaimWidgetLayout: React.FunctionComponent<IExternalProps> = ({
  tokenName,
  totalInvestors,
  totalEquivEurUlps,
  canClaimToken,
  etoId,
  onClaim,
}) => (
  <>
    <Message
      title={<FormattedMessage id="shared-component.eto-overview.success" />}
      summary={
        process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" ? (
          <FormattedMessage
            id="shared-component.eto-overview.success.summary"
            values={{
              totalAmount: (
                <Money
                  value={totalEquivEurUlps}
                  currency={ECurrency.EUR}
                  currencySymbol={ECurrencySymbol.SYMBOL}
                />
              ),
              totalInvestors,
            }}
          />
        ) : (
          <FormattedMessage
            id="shared-component.eto-overview.success.summary-no-investors-count"
            values={{
              totalAmount: (
                <Money
                  value={totalEquivEurUlps}
                  currency={ECurrency.EUR}
                  currencySymbol={ECurrencySymbol.SYMBOL}
                />
              ),
            }}
          />
        )
      }
    />
    {canClaimToken && (
      <Button
        onClick={() => {
          onClaim(etoId);
        }}
      >
        <FormattedMessage
          id="shared-component.eto-overview.claim-your-token"
          values={{ tokenName }}
        />
      </Button>
    )}
  </>
);

export const ClaimWidget = withCanClaimToken(ClaimWidgetLayout);
