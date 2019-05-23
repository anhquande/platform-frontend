import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { externalRoutes } from "../../config/externalRoutes";
import { withContainer } from "../../utils/withContainer.unsafe";
import { appRoutes } from "../appRoutes";
import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";
import { ButtonLink, ButtonSize, EButtonLayout, EButtonTheme } from "../shared/buttons";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutUnauthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";
import { ENeonHeaderSize, NeonHeader } from "./shared/NeonHeader";

import * as styles from "./Landing.module.scss";

const LandingLayout: React.FunctionComponent = () => (
  <div className={styles.landingWrapper} data-test-id="landing-page">
    <section className={styles.landing}>
      <NeonHeader size={ENeonHeaderSize.BIG}>
        <FormattedHTMLMessage id="platform.landing.featured.header" tagName="span" />
      </NeonHeader>
      <p className={styles.landingDescription}>
        <FormattedHTMLMessage
          values={{ href: externalRoutes.issueEto }}
          id="platform.landing.featured.description"
          tagName="span"
        />
      </p>
      <section className={styles.landingFeaturesContainer}>
        <h3 className={cn(styles.landingFeaturesHeader)}>
          <FormattedMessage id="platform.landing.list.header" />
        </h3>
        <ul className={cn(styles.landingFeatures, "pure")}>
          <li>
            <FormattedMessage id="platform.landing.list.first" />
          </li>
          <li>
            <FormattedMessage id="platform.landing.list.second" />
          </li>
          <li>
            <FormattedMessage id="platform.landing.list.third" />
          </li>
          <li>
            <FormattedMessage id="platform.landing.list.fourth" />
          </li>
          <li>
            <FormattedMessage id="platform.landing.list.fifth" />
          </li>
        </ul>
        <div className="mt-5">
          <ButtonLink
            theme={EButtonTheme.NEON}
            className="mr-5 mb-5"
            layout={EButtonLayout.SECONDARY}
            size={ButtonSize.HUGE}
            to={appRoutes.register}
          >
            <FormattedMessage id="wallet-selector.register" />
          </ButtonLink>
          <ButtonLink
            size={ButtonSize.HUGE}
            theme={EButtonTheme.GRAPHITE}
            className="mb-5"
            layout={EButtonLayout.PRIMARY}
            to={appRoutes.login}
          >
            <FormattedMessage id="wallet-selector.login" />
          </ButtonLink>
        </div>
      </section>
    </section>
  </div>
);

const Landing = compose(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
)(LandingLayout);

export { Landing };
