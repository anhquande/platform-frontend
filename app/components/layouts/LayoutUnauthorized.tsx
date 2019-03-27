import * as React from "react";

import { Footer } from "./Footer";
import { Header } from "./header/Header";
import { layoutEnchancer } from "./LayoutEnchancer";

import * as styles from "./LayoutShared.module.scss";

export const LayoutUnauthorizedComponent: React.FunctionComponent = ({ children }) => (
  <>
    <Header />

    <div className={`wrapper ${styles.layoutBg}`}>{children}</div>

    <Footer />
  </>
);

export const LayoutUnauthorized = layoutEnchancer(LayoutUnauthorizedComponent);
