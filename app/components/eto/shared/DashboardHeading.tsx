import * as React from "react";

import { TTranslatedString } from "../../../types";
import { EHeadingSize, Heading } from "../../shared/Heading";

interface IProps {
  title: string | React.ReactNode;
  step?: number;
  description?: TTranslatedString;
  "data-test-id"?: string;
  className?: string;
  size?: EHeadingSize;
}

const DashboardHeading: React.FunctionComponent<IProps> = ({
  title,
  step,
  "data-test-id": dataTestId,
  className,
  size,
  description,
}) => (
  <Heading
    level={3}
    className={className}
    decorator={false}
    size={size}
    data-test-id={dataTestId}
    description={description}
  >
    {step && <>STEP {step}:</>} {title}
  </Heading>
);

export { DashboardHeading };
