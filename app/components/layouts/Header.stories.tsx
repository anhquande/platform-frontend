import { storiesOf } from "@storybook/react";
import * as React from "react";

import { HeaderComponent } from "./Header.unsafe";

storiesOf("Layout/Header", module)
  .add("investor", () => (
    <>
      <HeaderComponent isAuthorized={false} logout={() => {}} location={"foo"} />
      <br />
      <HeaderComponent isAuthorized={true} logout={() => {}} location={"foo"} />
    </>
  ))
  .add("issuer", () => (
    <>
      <HeaderComponent isAuthorized={false} logout={() => {}} location={"foo"} />
      <br />
      <HeaderComponent isAuthorized={true} logout={() => {}} location={"foo"} />
    </>
  ));
