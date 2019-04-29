import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EETOStateOnChain } from "../../../../../modules/eto/types";
import { withStore } from "../../../../../utils/storeDecorator.unsafe";
import { CampaigningActivatedWidgetComponent } from "./CampaigningActivatedWidget";

storiesOf("ETO/CampaigningActivatedWidgetComponent", module)
  .addDecorator(withStore({}))
  .add("default", () => (
    <CampaigningActivatedWidgetComponent
      isInvestorsLimitReached={false}
      isWaitingForNextStateToStart={false}
      etoId="test"
      investorsLimit={500}
      minPledge={10}
      nextState={EETOStateOnChain.Claim}
      isActive={true}
      keyQuoteFounder="Quotes are like boats"
      pledgedAmount={100}
      investorsCount={1}
      isInvestor={true}
      isVerifiedInvestor={true}
    />
  ))
  .add("Investor Limit Reached", () => (
    <CampaigningActivatedWidgetComponent
      isInvestorsLimitReached={true}
      isWaitingForNextStateToStart={false}
      etoId="test"
      investorsLimit={500}
      minPledge={10}
      nextState={EETOStateOnChain.Claim}
      isActive={true}
      keyQuoteFounder="Quotes are like boats"
      pledgedAmount={100}
      investorsCount={1}
      isInvestor={true}
      isVerifiedInvestor={true}
    />
  ));
