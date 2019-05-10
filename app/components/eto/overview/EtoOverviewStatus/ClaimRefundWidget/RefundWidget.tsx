import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../../shared/buttons";
import { Message } from "../Message";
import { withCanClaimToken } from "./withCanClaimToken";

interface IExternalProps {
  canClaimToken: boolean;
  onClaim: () => void;
}

const RefundWidgetLayout: React.FunctionComponent<IExternalProps> = ({ canClaimToken }) => (
  <>
    <Message
      showTick={false}
      summary={<FormattedMessage id="shared-component.eto-overview.refund" />}
    />
    {canClaimToken && (
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-eth-neur" />
      </Button>
    )}
  </>
);

// TODO: Remove binding between withCanClaimToken and RefundWidgetLayout
export const RefundWidget = withCanClaimToken(RefundWidgetLayout);
