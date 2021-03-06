import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../../modules/tx/types";
import { TimeLeft } from "../../../shared/TimeLeft.unsafe";
import { localTime, utcTime, weekdayLocal, weekdayUTC } from "../../../shared/utils";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const SetDateDetails: TransactionDetailsComponent<ETxSenderType.ETO_SET_DATE> = ({
  additionalData,
  className,
  txTimestamp,
}) => {
  const newStartDate = additionalData.newStartDate;

  return (
    <InfoList className={className}>
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.time-to-start-date" />}
        value={<TimeLeft refresh={false} asUtc={false} finalTime={newStartDate} />}
        data-test-id="set-eto-date-summary-time-to-eto"
      />
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date-utc" />}
        value={`${weekdayUTC(newStartDate)}, ${utcTime(newStartDate)}`}
      />
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date-local" />}
        value={`${weekdayLocal(newStartDate)}, ${localTime(newStartDate)}`}
      />

      {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
    </InfoList>
  );
};

export { SetDateDetails };
