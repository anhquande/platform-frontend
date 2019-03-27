import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import {
  getMessageTranslation,
  LedgerErrorMessage,
} from "../../translatedMessages/messages.unsafe";
import { createMessage } from "../../translatedMessages/utils";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

describe("<WalletLedgerInitComponent />", () => {
  it("should render error message", () => {
    const errorMsg = createMessage(LedgerErrorMessage.GENERIC_ERROR);
    const expectedResult = getMessageTranslation(errorMsg);
    const component = shallow(
      <WalletLedgerInitComponent
        errorMessage={errorMsg}
        isInitialConnectionInProgress={false}
        intl={dummyIntl}
      />,
    );

    expect(
      component
        .find(tid("ledger-wallet-error-msg"))
        .children()
        .get(0),
    ).to.be.deep.eq(expectedResult);
  });
});
