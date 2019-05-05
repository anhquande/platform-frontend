import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { LayoutUnauthorized } from "../../layouts/LayoutUnauthorized";

import * as styles from "./ErrorBoundary.module.scss";

export const ErrorBoundaryLayoutUnauthorized: React.FunctionComponent<{}> = () => (
  <LayoutUnauthorized>
    <div className={styles.errorLayout}>
      <FormattedMessage id="error-boundary.main-error-message" />
    </div>
  </LayoutUnauthorized>
);
