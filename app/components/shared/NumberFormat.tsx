import BigNumber from "bignumber.js";
import * as React from "react";

import { formatThousands } from "../../utils/Number.utils";

interface IProps {
  value: string | number | BigNumber;
}

const NumberFormat: React.FunctionComponent<IProps> = ({ value }) => (
  <>{formatThousands(`${value}`)}</>
);

export { NumberFormat };
