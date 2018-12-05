import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../shared/ErrorBoundaryPanel";

export const UploadTermSheetWidgetComponent: React.SFC<{}> = () => (
  <DashboardLinkWidget
    title={<FormattedMessage id={"settings.upload-term-sheet.title"} />}
    text={<FormattedMessage id="settings.upload-term-sheet-please-upload-term-sheet" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-term-sheet.title" />}
    buttonTid="dashboard-upload-termsheet"
  />
);

export const UploadTermSheetWidget = compose(createErrorBoundary(ErrorBoundaryPanel))(
  UploadTermSheetWidgetComponent,
);
