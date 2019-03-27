import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { injectIntlHelpers } from "../../../utils/injectIntlHelpers.unsafe";
import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";

export const UploadInvestmentMemorandum = injectIntlHelpers(({ intl: { formatIntlMessage } }) => {
  return (
    <DashboardLinkWidget
      title={formatIntlMessage("settings.upload-investment-memorandum.title")}
      text={
        <FormattedMessage id="settings.upload-investment-memorandum-please-upload-prospectus" />
      }
      to={appRoutes.documents}
      buttonText={<FormattedMessage id="settings.upload-investment-button.title" />}
    />
  );
});
