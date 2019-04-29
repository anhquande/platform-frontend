import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers.unsafe";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { InvestmentSelectionComponent } from "./Investment";
import { wallets } from "./InvestmentTypeSelector.stories";

const Investment = injectIntlHelpers(InvestmentSelectionComponent);

storiesOf("Investment/Form", module)
  .addDecorator(withModalBody())
  .addDecorator(story => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {story}
    </Formik>
  ))
  .add("default with error", () => (
    <Investment
      wallets={wallets}
      changeEthValue={() => {}}
      changeEuroValue={() => {}}
      changeInvestmentType={() => {}}
      equityTokenCount={"1234"}
      errorState={EInvestmentErrorState.ExceedsWalletBalance}
      ethValue={"1234123412341232341234"}
      // tslint:disable-next-line:no-object-literal-type-assertion
      eto={{ etoId: "some-eto-id" } as TEtoWithCompanyAndContract}
      euroValue={"123412341234123412341234"}
      gasCostEth={"123412323412341234"}
      gasCostEuro={"12341234123412341234"}
      etherPriceEur={"123412341234123412341234"}
      eurPriceEther={"0.123412341234123412341234"}
      investEntireBalance={() => {}}
      investmentType={EInvestmentType.Eth}
      minTicketEth={"12341234123412341234"}
      minTicketEur={"1234"}
      maxTicketEur={"123456"}
      readyToInvest={false}
      showTokens={true}
      sendTransaction={() => {}}
      hasPreviouslyInvested={true}
      startUpgradeFlow={() => {}}
    />
  ));
