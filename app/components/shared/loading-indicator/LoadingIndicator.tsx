import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { assertNever } from "../../../utils/assertNever";
import { InlineIcon } from "../icons/InlineIcon";
import { LoadingIndicatorHexagon } from "./LoadingIndicatorHexagon";

import * as spinning from "./../../../assets/img/inline_icons/spinner.svg";
import * as styles from "./LoadingIndicator.module.scss";

export enum ELoadingIndicator {
  PULSE = "pulse",
  BLOCKS = "blocks",
  HEXAGON = "hexagon",
  SPINNER = "spinner",
}

interface ILoadingIndicatorProps {
  light?: boolean;
  type?: ELoadingIndicator;
}

const LoadingIndicator: React.FunctionComponent<ILoadingIndicatorProps & CommonHtmlProps> = ({
  className,
  light,
  type = ELoadingIndicator.PULSE,
}) => {
  switch (type) {
    case ELoadingIndicator.PULSE:
      return (
        <div
          data-test-id="loading-indicator-pulse"
          className={cn(className, styles.pulse, { [styles.light]: light })}
        />
      );
    case ELoadingIndicator.BLOCKS:
      return (
        <div className={cn(className, styles.blocks)}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case ELoadingIndicator.SPINNER:
      return (
        <div className={cn(className, styles.spinner)}>
          <InlineIcon svgIcon={spinning} />
        </div>
      );
    case ELoadingIndicator.HEXAGON:
      return <LoadingIndicatorHexagon />;
    default:
      return assertNever(type, `Invalid loading indicator type "${type}"`);
  }
};

export { LoadingIndicator };
