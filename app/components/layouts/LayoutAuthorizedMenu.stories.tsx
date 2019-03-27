import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../lib/api/users/interfaces";
import { LayoutAuthorizedMenuComponent } from "./LayoutAuthorizedMenu.unsafe";

storiesOf("LayoutAuthorizedMenu", module)
  .add("investor menu with action required settings", () => (
    <LayoutAuthorizedMenuComponent
      userType={EUserType.INVESTOR}
      isClaimsVerified={false}
      actionRequiredSettings={true}
      isIdentityModalOpened={false}
      isLinkActive={() => false}
      shouldEtoDataLoad={false}
      openIdentityModal={action("open identity modal")}
    />
  ))
  .add("investor menu", () => (
    <LayoutAuthorizedMenuComponent
      userType={EUserType.INVESTOR}
      isClaimsVerified={false}
      actionRequiredSettings={false}
      isIdentityModalOpened={false}
      isLinkActive={() => false}
      shouldEtoDataLoad={false}
      openIdentityModal={action("open identity modal")}
    />
  ))
  .add("issuer menu with action required setting", () => (
    <LayoutAuthorizedMenuComponent
      userType={EUserType.ISSUER}
      isClaimsVerified={false}
      actionRequiredSettings={true}
      isIdentityModalOpened={false}
      isLinkActive={() => false}
      shouldEtoDataLoad={false}
      openIdentityModal={action("open identity modal")}
    />
  ))
  .add("issuer menu", () => (
    <LayoutAuthorizedMenuComponent
      userType={EUserType.ISSUER}
      isClaimsVerified={false}
      actionRequiredSettings={false}
      isIdentityModalOpened={false}
      isLinkActive={() => false}
      shouldEtoDataLoad={true}
      openIdentityModal={action("open identity modal")}
    />
  ));
