import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { InlineIcon } from "../icons";
import { LoadingIndicator } from "../loading-indicator";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Button.module.scss";

export enum EButtonTheme {
  DARK = styles.buttonDark,
  WHITE = styles.buttonWhite,
  BRAND = styles.buttonBrand,
  SILVER = styles.buttonSilver,
  GRAPHITE = styles.buttonGraphite,
  NEON = styles.buttonNeon,
  GREEN = styles.buttonGreen,
  BLUE = styles.buttonBlue,
}

export enum EIconPosition {
  ICON_BEFORE = "icon-before",
  ICON_AFTER = "icon-after",
}

export enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  SECONDARY = styles.buttonSecondary,
  INLINE = styles.buttonInline,
  SIMPLE = styles.buttonSimple,
}

export enum ButtonSize {
  NORMAL,
  SMALL = styles.buttonSmall,
  HUGE = styles.buttonHuge,
}

export enum ButtonWidth {
  NORMAL = "",
  WIDE = "wide",
  BLOCK = "block",
}

export enum ButtonTextPosition {
  LEFT = "text-left",
  RIGHT = "text-right",
}

export interface IGeneralButton {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export interface IButtonProps extends IGeneralButton, CommonHtmlProps {
  layout?: EButtonLayout;
  theme?: EButtonTheme;
  svgIcon?: string;
  type?: string;
  iconPosition?: EIconPosition;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
  innerClassName?: string;
  textPosition?: ButtonTextPosition;
}

const Button: React.ForwardRefExoticComponent<
  { children?: React.ReactNode } & IButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      className,
      layout,
      theme,
      disabled,
      svgIcon,
      innerClassName,
      iconPosition,
      size,
      width,
      isLoading,
      type,
      textPosition,
      isActive,
      onClick,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        styles.button,
        className,
        layout,
        iconPosition,
        {
          [theme!]: layout !== EButtonLayout.INLINE,
          [styles.isActive]: isActive,
        },
        size,
        width,
      )}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      {...props}
    >
      <div className={cn(styles.content, innerClassName, textPosition)} tabIndex={-1}>
        {isLoading ? (
          <LoadingIndicator light />
        ) : (
          <>
            {iconPosition === EIconPosition.ICON_BEFORE && <InlineIcon svgIcon={svgIcon || ""} />}
            {children}
            {iconPosition === EIconPosition.ICON_AFTER && <InlineIcon svgIcon={svgIcon || ""} />}
          </>
        )}
      </div>
    </button>
  ),
);

Button.defaultProps = {
  layout: EButtonLayout.PRIMARY,
  theme: EButtonTheme.DARK,
  type: "button",
  disabled: false,
  size: ButtonSize.NORMAL,
  width: ButtonWidth.NORMAL,
};

const ButtonArrowRight: React.FunctionComponent<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.SECONDARY}
    iconPosition={EIconPosition.ICON_AFTER}
    svgIcon={arrowRight}
  />
);

export { ButtonArrowRight, Button };
