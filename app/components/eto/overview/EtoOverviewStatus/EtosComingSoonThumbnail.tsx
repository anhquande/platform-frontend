import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";

import { Panel } from "../../../shared/Panel";
import { ResponsiveImage } from "../../../shared/ResponsiveImage";

import * as comingSoonImg from "../../../../assets/img/etos-comings-soon/coming-soon.png";
import * as styles from "./EtosComingSoonThumbnail.module.scss";

export const EtosComingSoonThumbnail: React.FunctionComponent = () => (
  <Panel data-test-id="eto-overview-coming-soon">
    <ResponsiveImage
      theme={"light"}
      width={400}
      height={400}
      srcSet={{
        "1x": comingSoonImg,
      }}
      alt=""
    />
    <p className={styles.text}>
      <FormattedHTMLMessage tagName="span" id="dashboard.eto.thumbnail.coming-soon-placeholder" />
    </p>
  </Panel>
);
