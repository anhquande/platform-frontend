import * as cn from "classnames";
import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

import * as styles from "./Navigation.module.scss";

interface INavigation {
  text: string;
  forward: boolean;
  className?: string;
}

interface INavigationButton {
  onClick: () => void;
  disabled?: boolean;
}

export const NavigationButton: React.FunctionComponent<INavigation & INavigationButton> = ({
  text,
  forward,
  className,
  onClick,
  disabled,
}) => {
  const props: any = {
    className: cn(
      className,
      styles.container,
      disabled && styles.disabled,
      forward ? styles.right : styles.left,
    ),
  };

  if (!disabled) {
    props.onClick = onClick;
  } else {
    props.tabIndex = -1;
  }

  return (
    <span tabIndex={0} {...props}>
      {!forward && <i className={"fa fa-chevron-left mr-2"} aria-hidden="true" />}
      {text}
      {forward && <i className={"fa fa-chevron-right ml-2"} aria-hidden="true" />}
    </span>
  );
};

export const NavigationLink: React.FunctionComponent<INavigation & LinkProps> = ({
  text,
  forward,
  className,
  to,
  ...props
}) => {
  return (
    <Link
      to={to}
      className={cn(className, styles.container, forward ? styles.right : styles.left)}
      {...props}
    >
      {!forward && <i className={"fa fa-chevron-left mr-2"} aria-hidden="true" />}
      {text}
      {forward && <i className={"fa fa-chevron-right ml-2"} aria-hidden="true" />}
    </Link>
  );
};
