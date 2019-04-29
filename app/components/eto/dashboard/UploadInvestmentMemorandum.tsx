import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
import { appRoutes } from "../../appRoutes";
import { EColumnSpan } from "../../layouts/Container";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";

interface IExternalProps {
  columnSpan: EColumnSpan;
}

export const UploadInvestmentMemorandumLayout: React.FunctionComponent<
  IExternalProps & IIntlProps
> = ({ columnSpan, intl: { formatIntlMessage } }) => (
  <DashboardLinkWidget
    title={formatIntlMessage("settings.upload-investment-memorandum.title")}
    text={<FormattedMessage id="settings.upload-investment-memorandum-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-investment-button.title" />}
    columnSpan={columnSpan}
  />
);

export const UploadInvestmentMemorandum = compose<React.FunctionComponent<IExternalProps>>(
  injectIntlHelpers,
)(UploadInvestmentMemorandumLayout);
