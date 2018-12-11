import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { testCompany, testEto } from "../../../../test/fixtures";
import { withStore } from "../../../utils/storeDecorator";
import { EtoPublicComponent } from "./EtoPublicComponent";

const testStore = {
  publicEtos: {
    publicEtos: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testEto,
    },
    contracts: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testEto,
    },
    companies: {
      "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0": testCompany,
    },
  },
};

storiesOf("ETO/EtoOverview", module)
  .addDecorator(withStore(testStore as any))
  .add("default", () => (
    <Container>
      <EtoPublicComponent etoData={testEto as any} companyData={testCompany as any} />
    </Container>
  ));
