import * as React from "react";

import { Footer } from "./Footer";
import { Header } from "./Header.unsafe";

import * as styles from "./LayoutShared.module.scss";

export const LayoutUnauthorized: React.FunctionComponent = ({ children }) => (
  <>
    <Header />

    <div className={`wrapper ${styles.layoutBg}`}>{children}</div>

    <Footer />
  </>
);
