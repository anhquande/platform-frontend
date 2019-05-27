import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";

import { Panel } from "../../../shared/Panel";
import { ResponsiveImage } from "../../../shared/ResponsiveImage";

import * as comingSoonImg from "../../../../assets/img/etos-comings-soon/comming_soon.png";
import * as styles from "./EtosComingSoonThumbnail.module.scss";

export const EtosComingSoonThumbnail: React.FunctionComponent = () => (
  <Col className="mb-4" xs={12} md={6} lg={4}>
    <Panel data-test-id={`eto-overview-coming-soon`}>
      <ResponsiveImage
        theme={"light"}
        width={400}
        height={400}
        srcSet={{
          "1x": comingSoonImg,
        }}
        alt="Coming soon"
      />
      <span className={styles.text}>
        <FormattedMessage id="dashboard.eto.thumbnail.coming-soon-placeholder" />
      </span>
    </Panel>
  </Col>
);
