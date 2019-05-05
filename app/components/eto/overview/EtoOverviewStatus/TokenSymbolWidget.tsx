import * as React from "react";

import { IResponsiveImage, ResponsiveImage } from "../../../shared/ResponsiveImage";

import * as styles from "./TokenSymbolWidget.module.scss";

export interface ITokenSymbolWidgetProps {
  tokenImage: IResponsiveImage;
  brandName?: string;
  tokenName?: string;
  tokenSymbol?: string;
}

const TokenSymbolWidget: React.FunctionComponent<ITokenSymbolWidgetProps> = ({
  tokenSymbol,
  tokenName,
  tokenImage,
  brandName,
}) => (
  <div className={styles.tokenSymbolWidget}>
    <div className={styles.tokenImageWrapper}>
      <ResponsiveImage {...tokenImage} className={styles.tokenImage} />
    </div>
    <div>
      <h3 className={styles.brandName}>{brandName}</h3>
      <h4 className={styles.tokenName}>
        {tokenName}
        {tokenSymbol && ` (${tokenSymbol})`}
      </h4>
    </div>
  </div>
);

export { TokenSymbolWidget };
