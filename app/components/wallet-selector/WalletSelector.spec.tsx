import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletSelectorLayout } from "./WalletSelector";

describe("<WalletSelector />", () => {
  it("should render message signing", () => {
    const component = shallow(
      <WalletSelectorLayout
        isMessageSigning={true}
        rootPath="rootPath"
        oppositeRoute="oppositeRoute"
        userType="investor"
        isLoginRoute
        openICBMModal={() => {}}
      />,
    );

    expect(component.contains(<WalletMessageSigner rootPath="rootPath" />)).to.be.true;
  });
});
