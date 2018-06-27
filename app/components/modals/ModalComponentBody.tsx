import * as React from "react";
import { ButtonClose } from "../shared/Buttons";
import { Panel } from "../shared/Panel";
import * as styles from "./ModalComponentBody.module.scss";

export interface IModalComponentProps {
  onClose?: () => void;
}

export const ModalComponentBody: React.SFC<IModalComponentProps> = ({
  children,
  onClose,
  ...props
}) => (
  <Panel className={styles.modal} {...props}>
    <div className={styles.header}>
      <ButtonClose onClick={onClose} />
    </div>
    <div className={styles.body}>{children}</div>
  </Panel>
);
