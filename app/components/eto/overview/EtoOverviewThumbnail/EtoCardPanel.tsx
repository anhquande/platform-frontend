import * as React from "react";

import { Panel } from "../../../shared/Panel";

import * as styles from "./EtoCardPanel.module.scss";

interface IBaseProps {
  "data-test-id"?: string;
  onClick: () => void;
}

export const EtoCardPanel: React.FunctionComponent<IBaseProps> = ({
  children,
  onClick,
  "data-test-id": dataTestId,
}) => (
  <button className={styles.button} onClick={onClick}>
    <Panel data-test-id={dataTestId}>{children}</Panel>
  </button>
);
