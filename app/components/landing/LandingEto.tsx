import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose } from "redux";

import { IIntlProps, injectIntlHelpers } from "../../utils/injectIntlHelpers.unsafe";
import { withContainer } from "../../utils/withContainer.unsafe";
import { appRoutes } from "../appRoutes";
import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";
import { CenteredListWithTitle } from "../shared/CenteredListWithTitle";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutUnauthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";
import { OffToOnCompany } from "./shared/OffToOnChainCompany";
import { RegisterCta } from "./shared/RegisterCta";

import * as styles from "./LandingEto.module.scss";

export const LandingEtoComponent: React.FunctionComponent<IIntlProps> = ({
  intl: { formatIntlMessage },
}) => {
  return (
    <div className={styles.landingEto} data-test-id="landing-eto-page">
      <RegisterCta
        text={formatIntlMessage("eto-landing.register.cta")}
        ctaText={formatIntlMessage("eto-landing.register.buttonText")}
        ctaLink={appRoutes.registerEto}
      />
      <section className={cn(styles.landingContainer, "t-white")}>
        <Container>
          <Row>
            <Col>
              <h2>
                <FormattedMessage id={"eto-landing.why-fundraise.header"} />
              </h2>
              <Row>
                <CenteredListWithTitle
                  title={formatIntlMessage("eto-landing.why-fundraise.section1.title")}
                  list={[
                    formatIntlMessage("eto-landing.why-fundraise.section1.text1"),
                    formatIntlMessage("eto-landing.why-fundraise.section1.text2"),
                    formatIntlMessage("eto-landing.why-fundraise.section1.text3"),
                  ]}
                />
                <CenteredListWithTitle
                  title={formatIntlMessage("eto-landing.why-fundraise.section2.title")}
                  list={[
                    formatIntlMessage("eto-landing.why-fundraise.section2.text1"),
                    formatIntlMessage("eto-landing.why-fundraise.section2.text2"),
                  ]}
                />
                <CenteredListWithTitle
                  title={formatIntlMessage("eto-landing.why-fundraise.section3.title")}
                  list={[
                    formatIntlMessage("eto-landing.why-fundraise.section3.text1"),
                    formatIntlMessage("eto-landing.why-fundraise.section3.text2"),
                  ]}
                />
                <CenteredListWithTitle
                  title={formatIntlMessage("eto-landing.why-fundraise.section4.title")}
                  list={[
                    formatIntlMessage("eto-landing.why-fundraise.section4.text1"),
                    formatIntlMessage("eto-landing.why-fundraise.section4.text2"),
                  ]}
                />
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={styles.landingContainer}>
        <Container>
          <Row>
            <Col>
              <h2>
                <FormattedMessage id="eto-landing.steps-to-eto.title" />
              </h2>
              <OffToOnCompany
                steps={[
                  {
                    title: formatIntlMessage("eto-landing.steps-to-eto.step1.title"),
                    description: formatIntlMessage("eto-landing.steps-to-eto.step1.description"),
                  },
                  {
                    title: formatIntlMessage("eto-landing.steps-to-eto.step2.title"),
                    description: formatIntlMessage("eto-landing.steps-to-eto.step2.description"),
                  },
                  {
                    title: formatIntlMessage("eto-landing.steps-to-eto.step3.title"),
                    description: formatIntlMessage("eto-landing.steps-to-eto.step3.description"),
                  },
                  {
                    title: formatIntlMessage("eto-landing.steps-to-eto.step4.title"),
                    description: formatIntlMessage("eto-landing.steps-to-eto.step4.description"),
                  },
                  {
                    title: formatIntlMessage("eto-landing.steps-to-eto.step5.title"),
                    description: formatIntlMessage("eto-landing.steps-to-eto.step5.description"),
                  },
                  {
                    title: formatIntlMessage("eto-landing.steps-to-eto.step6.title"),
                    description: formatIntlMessage("eto-landing.steps-to-eto.step6.description"),
                  },
                ]}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export const LandingEto: React.FunctionComponent<IIntlProps> = compose<
  React.FunctionComponent<IIntlProps>
>(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
  injectIntlHelpers,
)(LandingEtoComponent);
