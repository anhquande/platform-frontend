import * as cn from "classnames";
import * as React from "react";

import * as styles from "./InfoBlock.module.scss";

interface IProps {
  className?: string;
}

export const InfoBlock: React.FunctionComponent<IProps> = ({ className, children }) => (
  <div className={cn(styles.infoBlock, className)}>{children}</div>
);
