import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";
import { MoneyNew } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
import { Message } from "../Message";
import { withCanClaimToken } from "./withCanClaimToken";

interface IExternalProps {
  tokenName: string;
  totalInvestors: string | undefined;
  totalEquivEurUlps: string;
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
                <MoneyNew
                  value={totalEquivEurUlps}
                  inputFormat={ENumberInputFormat.ULPS}
                  moneyFormat={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.FULL}
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
                <MoneyNew
                  value={totalEquivEurUlps}
                  inputFormat={ENumberInputFormat.ULPS}
                  moneyFormat={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.FULL}
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
