import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../types";
import { ButtonIcon } from "./buttons";
import { showInfoToast } from "./Toast";

import * as clipboardIcon from "../../assets/img/inline_icons/icon-clipboard.svg";
import * as styles from "./CopyToClipboard.module.scss";

interface IProps {
  value: string | React.ReactNode;
  message?: TTranslatedString;
  className?: string;
  "data-test-id"?: string;
}

class CopyToClipboard extends React.Component<IProps> {
  private inputNode: any = React.createRef();
  private inputRef = (element: any) => (this.inputNode = element);

  private copyToClipboard = (): void => {
    this.inputNode.select();
    document.execCommand("copy");

    showInfoToast(
      this.props.message || <FormattedMessage id="shared-component.copy-to-clipboard.copied" />,
    );
  };

  render(): React.ReactNode {
    const { "data-test-id": dataTestId, value, className } = this.props;

    return (
      <>
        <input
          className={cn(styles.hiddenInput)}
          ref={this.inputRef}
          value={value as string}
          readOnly
          data-test-id={dataTestId}
        />
        <ButtonIcon className={className} svgIcon={clipboardIcon} onClick={this.copyToClipboard} />
      </>
    );
  }
}

export { CopyToClipboard };
