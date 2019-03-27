import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { HeaderComponent } from "./Header";

storiesOf("Layout/Header", module)
  .add("investor", () => (
    <>
      <HeaderComponent
        monitorPendingTransaction={action("monitorPendingTransaction")}
        isAuthorized={false}
        logout={action("logout")}
        location={"foo"}
      />
      <br />
      <HeaderComponent
        monitorPendingTransaction={action("monitorPendingTransaction")}
        isAuthorized={true}
        logout={action("logout")}
        location={"foo"}
      />
    </>
  ))
  .add("issuer", () => (
    <>
      <HeaderComponent
        monitorPendingTransaction={action("monitorPendingTransaction")}
        isAuthorized={false}
        logout={action("logout")}
        location={"foo"}
      />
      <br />
      <HeaderComponent
        monitorPendingTransaction={action("monitorPendingTransaction")}
        isAuthorized={true}
        logout={action("logout")}
        location={"foo"}
      />
    </>
  ));
