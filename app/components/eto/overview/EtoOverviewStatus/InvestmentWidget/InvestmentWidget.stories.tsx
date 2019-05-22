import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../../../test/fixtures";
import { InvestmentWidget } from "./InvestmentWidget";

storiesOf("ETO/InvestmentWidget", module).add("default", () => <InvestmentWidget eto={testEto} />);
