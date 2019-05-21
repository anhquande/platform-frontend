import * as React from "react";

import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";

import * as styles from "./Content.module.scss";

export const Content: React.FunctionComponent = ({ children }) => (
  <div className={styles.content}>
    <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
  </div>);
