import * as cn from "classnames";
import * as React from "react";

import * as styles from "./ButtonGroup.module.scss";

export enum EButtonGroupSize {
  NORMAL = styles.sizeNormal,
  SMALL = styles.sizeSmall,
}

export type TButtonGroupExternalProps = {
  size?: EButtonGroupSize;
};

const ButtonGroup: React.FunctionComponent<TButtonGroupExternalProps> = ({ children, size }) => (
  <section className={cn(styles.buttonGroup, size)}>{children}</section>
);

ButtonGroup.defaultProps = {
  size: EButtonGroupSize.NORMAL,
};

export { ButtonGroup };
