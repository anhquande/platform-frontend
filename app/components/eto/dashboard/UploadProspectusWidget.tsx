import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

export const UploadProspectusWidgetComponent: React.FunctionComponent<{}> = () => (
  <DashboardLinkWidget
    title={<FormattedMessage id={"settings.upload-prospectus.title"} />}
    text={<FormattedMessage id="settings.upload-prospectus-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-prospectus.title" />}
  />
);

export const UploadProspectusWidget = compose(createErrorBoundary(ErrorBoundaryPanel))(
  UploadProspectusWidgetComponent,
);
