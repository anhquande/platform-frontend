import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { LayoutBase } from "../../layouts/LayoutBase";

import * as styles from "./ErrorBoundary.module.scss";

export const ErrorBoundaryLayoutBase: React.FunctionComponent<{}> = () => (
  <LayoutBase>
    <div className={styles.errorLayout}>
      <FormattedMessage id="error-boundary.main-error-message" />
    </div>
  </LayoutBase>
);
