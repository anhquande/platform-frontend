import * as React from "react";

import { Footer } from "./Footer";
import { Header } from "./header/Header";
import { layoutEnhancer } from "./LayoutEnhancer";

import * as styles from "./LayoutShared.module.scss";

type TExternalProps = {
  hideHeaderCtaButtons?: boolean;
};

export const LayoutUnauthorizedComponent: React.FunctionComponent<TExternalProps> = ({
  children,
  hideHeaderCtaButtons,
}) => (
  <>
    <Header hideCtaButtons={hideHeaderCtaButtons} />

    <div className={`wrapper ${styles.layoutBg}`}>{children}</div>

    <Footer />
  </>
);

export const LayoutUnauthorized = layoutEnhancer(LayoutUnauthorizedComponent);
