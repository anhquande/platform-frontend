import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { getCurrentInvestmentProgressPercentage } from "../../../../lib/api/eto/EtoUtils";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "../../../../modules/eto/types";
import { MoneyNew } from "../../../shared/formatters/Money";
import {
  ECurrency,
  EHumanReadableFormat,
  EMoneyInputFormat,
} from "../../../shared/formatters/utils";
import { CounterWidget } from "../EtoOverviewStatus/CounterWidget";
import { InvestmentStatus } from "./InvestmentStatus/InvestmentStatus";
import { Whitelist } from "./Whitelist/Whitelist";

import * as styles from "./EtoStatusManager.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
  etoSubState: EEtoSubState | undefined;
}

const EtoStatusManager = ({ eto, etoSubState }: IExternalProps) => {
  const state = eto.contract ? eto.contract.timedState : eto.state;

  switch (state) {
    case EEtoState.LISTED:
    case EEtoState.PROSPECTUS_APPROVED:
    case EETOStateOnChain.Setup: {
      return <Whitelist eto={eto} etoSubState={etoSubState} />;
    }
    case EETOStateOnChain.Whitelist: {
      const endDate = eto.contract!.startOfStates[EETOStateOnChain.Public]!;

      if (etoSubState === EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE) {
        return <CounterWidget endDate={endDate} state={EETOStateOnChain.Public} />;
      } else {
        return (
          <>
            <InvestmentStatus eto={eto} />
            <p className={styles.info}>
              <FormattedMessage
                id="eto-overview-thumbnail.presale.days-to-public-sale"
                values={{ endDate: moment(new Date()).to(endDate, true) }}
              />
            </p>
          </>
        );
      }
    }

    case EETOStateOnChain.Public: {
      const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);
      const endDate = eto.contract!.startOfStates[EETOStateOnChain.Signing]!;

      return (
        <>
          <InvestmentStatus eto={eto} />
          <p className={styles.info}>
            <FormattedMessage
              id="eto-overview-thumbnail.public-sale.days-left"
              values={{
                endDate: moment(new Date()).to(endDate, true),
                foundedPercentage: Math.floor(currentProgressPercentage),
              }}
            />
          </p>
        </>
      );
    }

    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Signing:
    case EETOStateOnChain.Payout: {
      return (
        <>
          <InvestmentStatus eto={eto} />
          <p className={styles.info}>
            <FormattedMessage
              id="eto-overview-thumbnail.success.raised-amount"
              values={{
                totalAmount: (
                  <MoneyNew
                    value={eto.contract!.totalInvestment.totalEquivEurUlps}
                    inputFormat={EMoneyInputFormat.ULPS}
                    moneyFormat={ECurrency.EUR}
                    outputFormat={EHumanReadableFormat.FULL}
                  />
                ),
              }}
            />
          </p>
        </>
      );
    }

    case EETOStateOnChain.Refund: {
      return (
        <>
          <InvestmentStatus eto={eto} />
          <p className={styles.info}>
            <FormattedMessage id="eto-overview-thumbnail.refund.claim-refund" />
          </p>
        </>
      );
    }

    default:
      throw new Error(`State (${state}) is not known. Please provide implementation.`);
  }
};

export { EtoStatusManager };
