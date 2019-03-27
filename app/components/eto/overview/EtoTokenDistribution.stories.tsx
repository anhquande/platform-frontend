import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoTokenDistribution } from "./EtoTokenDistribution.unsafe";

const chartBarData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah", "Lorem", "Ipsum"],
  datasets: [
    {
      data: [130, 50, 20, 40, 50, 12, 100, 87],
      backgroundColor: [
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
      ],
    },
  ],
};

storiesOf("ETO/TokenDistribution", module).add("default", () => (
  <EtoTokenDistribution
    chartData={chartBarData}
    giniIndex={0.6162}
    tokenDistribution={[["1%", "1%"], ["1%", "1%"], ["1%", "1%"]]}
  />
));
