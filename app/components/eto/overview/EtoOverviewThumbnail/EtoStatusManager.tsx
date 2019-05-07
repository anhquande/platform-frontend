import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { getCurrentInvestmentProgressPercentage } from "../../../../lib/api/eto/EtoUtils";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { ECurrency } from "../../../shared/formatters/utils";
import { ECurrencySymbol, Money } from "../../../shared/Money.unsafe";
import { CounterWidget } from "./CounterWidget";
import { InvestmentStatus } from "./InvestmentStatus/InvestmentStatus";
import { Whitelist } from "./Whitelist/Whitelist";

import * as styles from "./EtoStatusManager.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
  isEligibleToPreEto: boolean;
}

const EtoStatusManager = ({ eto, isEligibleToPreEto }: IExternalProps) => {
  const timedState = eto.contract!.timedState;

  switch (timedState) {
    case EETOStateOnChain.Setup: {
      const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;
      const nextStateStartDate = eto.contract!.startOfStates[nextState];

      if (nextStateStartDate === undefined) {
        throw new Error("Next state should be defined as this point");
      }

      return <Whitelist eto={eto} nextStateStartDate={nextStateStartDate} />;
    }
    case EETOStateOnChain.Whitelist: {
      const endDate = eto.contract!.startOfStates[EETOStateOnChain.Public]!;

      if (isEligibleToPreEto) {
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
      } else {
        return <CounterWidget endDate={endDate} />;
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
                  <Money
                    value={eto.contract!.totalInvestment.totalEquivEurUlps}
                    currency={ECurrency.EUR}
                    currencySymbol={ECurrencySymbol.SYMBOL}
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
      throw new Error(`State (${timedState}) is not known. Please provide implementation.`);
  }
};

export { EtoStatusManager };
