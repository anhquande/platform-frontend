import * as cn from "classnames";
import * as H from "history";
import * as React from "react";

import { TTranslatedString } from "../../../types";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight, ButtonLink } from "../buttons";
import { Panel } from "../Panel";

import * as styles from "./DashboardLinkWidget.module.scss";

interface IProps {
  title: TTranslatedString;
  text: TTranslatedString;
  to: H.LocationDescriptor;
  buttonText: TTranslatedString;
  buttonTid?: string;
  columnSpan?: EColumnSpan;
}

export const DashboardLinkWidget: React.FunctionComponent<IProps> = ({
  title,
  text,
  to,
  buttonText,
  buttonTid,
  columnSpan,
}) => (
  <Panel headerText={title} columnSpan={columnSpan}>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>{text}</p>
      <div className="d-flex justify-content-center">
        <ButtonLink to={to} component={ButtonArrowRight} data-test-id={buttonTid}>
          {buttonText}
        </ButtonLink>
      </div>
    </div>
  </Panel>
);
