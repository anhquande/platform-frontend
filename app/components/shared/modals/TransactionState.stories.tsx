import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { withModalBody } from "../../../utils/storybookHelpers.unsafe";
import { DocumentLink } from "../DocumentLink";
import { TransactionState } from "./TransactionState";

storiesOf("Modals/TransactionState", module)
  .addDecorator(withModalBody())
  .add("pending", () => (
    <TransactionState state="pending" txHash="234523451234" blockNumber={12343456}>
      <p>
        Your TX has been broadcast to the network and is waiting to be mined & confirmed. During
        ICOs, it may take 3+ hours to confirm. While this transaction is pending you will be blocked
        from making another transaction on the platform. <a>View your transaction</a>.
      </p>
    </TransactionState>
  ))
  .add("reverted", () => (
    <TransactionState state="reverted" txHash="23452345lkjlkjh123kj4h123lk4jh" />
  ))
  .add("confirmed", () => (
    <TransactionState
      state="confirmed"
      txHash="01234912341234kjlh1234kjh1234lkjh2134"
      title={<FormattedMessage id="investment-flow.investment-confirmed" />}
    >
      <DocumentLink
        url="some.pdf"
        name={<FormattedMessage id="investment-flow.summary.download-agreement" />}
      />
    </TransactionState>
  ));
