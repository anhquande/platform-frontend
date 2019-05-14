import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { appRoutes } from "../../appRoutes";
import { EColumnSpan } from "../../layouts/Container";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

export const UploadTermSheetWidgetComponent: React.FunctionComponent<{
  columnSpan?: EColumnSpan;
}> = ({ columnSpan }) => (
  <DashboardLinkWidget
    title={<FormattedMessage id={"settings.upload-term-sheet.title"} />}
    text={<FormattedMessage id="settings.upload-term-sheet-please-upload-term-sheet" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-term-sheet.button-label" />}
    buttonTid="dashboard-upload-termsheet"
    columnSpan={columnSpan}
  />
);

export const UploadTermSheetWidget = compose(createErrorBoundary(ErrorBoundaryPanel))(
  UploadTermSheetWidgetComponent,
);
