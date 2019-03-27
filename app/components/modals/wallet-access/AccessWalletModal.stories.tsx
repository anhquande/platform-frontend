import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWalletType } from "../../../modules/web3/types";
import { withModalBody } from "../../../utils/storybookHelpers.unsafe";
import {
  BrowserWalletErrorMessage,
  getMessageTranslation,
  MismatchedWalletAddressErrorMessage,
  ProfileMessage,
} from "../../translatedMessages/messages.unsafe";
import { createMessage } from "../../translatedMessages/utils";
import { AccessWalletContainerComponent } from "./AccessWalletModal";

const props = {
  title: getMessageTranslation(createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_TITLE)),
  message: getMessageTranslation(
    createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_DESCRIPTION),
  ),
  errorMsg: undefined,
  isUnlocked: false,
  onAccept: () => {},
  walletType: EWalletType.LIGHT,
};

storiesOf("AccessWalletModal", module)
  .addDecorator(withModalBody())
  .add("lightwallet", () => <AccessWalletContainerComponent {...props} />)
  .add("lightwallet-unlocked", () => (
    <AccessWalletContainerComponent {...props} isUnlocked={true} />
  ))
  .add("metamask", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.BROWSER} />
  ))
  .add("metamask with error", () => {
    const data = {
      ...props,
      errorMessage: getMessageTranslation(
        createMessage(BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK),
      ),
    };
    return <AccessWalletContainerComponent {...data} walletType={EWalletType.BROWSER} />;
  })
  .add("ledger", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.LEDGER} />
  ))
  .add("ledger with error", () => {
    const testData = {
      ...props,
      errorMessage: getMessageTranslation(
        createMessage(MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS, {
          actualAddress: "12345",
          desiredAddress: "56789",
        }),
      ),
    };
    return <AccessWalletContainerComponent {...testData} walletType={EWalletType.LEDGER} />;
  });
