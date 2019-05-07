import BigNumber from "bignumber.js";
import * as React from "react";

import { formatThousands } from "./formatters/utils";

interface IProps {
  value: string | number | BigNumber;
}

/*
 * @deprecated
 * use  /Users/lexey/projects/platform-frontend/app/components/shared/formatters/FormatNumber.tsx
 * */
const NumberFormat: React.FunctionComponent<IProps> = ({ value }) => (
  <>{formatThousands(`${value}`)}</>
);

export { NumberFormat };
