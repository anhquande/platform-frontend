import * as cn from "classnames";
import * as React from "react";

import * as styles from "./Layout.module.scss";

export const WidgetGridLayout: React.FunctionComponent<{
  "data-test-id"?: string;
  className?: string;
  withOffset?: boolean;
}> = ({ children, className, "data-test-id": dataTestId, withOffset = true }) => (
  <div
    className={cn(styles.widgetLayout, { [styles.layoutOffset]: withOffset }, className)}
    data-test-id={dataTestId}
  >
    {children}
  </div>
);
