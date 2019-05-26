import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../../../../modules/actions";
import { selectBookbuildingStats } from "../../../../../modules/bookbuilding-flow/selectors";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "../../../../../modules/eto/types";
import { appConnect } from "../../../../../store";
import { onEnterAction } from "../../../../../utils/OnEnterAction";
import { CounterWidget } from "../../EtoOverviewStatus/CounterWidget";
import { WhitelistStatus } from "./WhitelistStatus";

import * as styles from "../EtoStatusManager.module.scss";

export interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
  etoSubState: EEtoSubState | undefined;
}

interface IStateProps {
  pledgedAmount: number | null;
  investorsCount: number;
}

type IProps = IExternalProps & IStateProps;

const WhitelistLayout: React.FunctionComponent<IProps> = ({
  eto,
  pledgedAmount,
  investorsCount,
  etoSubState,
}) => {
  switch (etoSubState) {
    case EEtoSubState.CAMPAIGNING:
      return (
        <p className={styles.info}>
          <FormattedMessage id="eto-overview-thumbnail.whitelist.is-not-started" />
        </p>
      );

    case EEtoSubState.WHITELISTING:
    case EEtoSubState.WHITELISTING_LIMIT_REACHED:
      return (
        <>
          <WhitelistStatus
            pledgedAmount={pledgedAmount}
            investorsCount={investorsCount}
            investorsLimit={eto.maxPledges}
          />

          <p className={styles.info}>
            {etoSubState === EEtoSubState.WHITELISTING_LIMIT_REACHED && (
              <FormattedMessage id="eto-overview-thumbnail.whitelist.is-closed" />
            )}
            {etoSubState === EEtoSubState.WHITELISTING && (
              <FormattedMessage id="eto-overview-thumbnail.whitelist.is-open" />
            )}
          </p>
        </>
      );

    case EEtoSubState.COUNTDOWN_TO_PRESALE:
    case EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE:
      const nextState =
        etoSubState === EEtoSubState.COUNTDOWN_TO_PRESALE
          ? EETOStateOnChain.Whitelist
          : EETOStateOnChain.Public;
      const nextStateStartDate = eto.contract!.startOfStates[nextState];

      if (nextStateStartDate === undefined) {
        throw new Error("Next state should be defined as this point");
      }

      return <CounterWidget endDate={nextStateStartDate} state={nextState} />;

    default:
      throw new Error(`Campaign doesn't implement ${etoSubState} state`);
  }
};

const Whitelist = compose<React.FunctionComponent<IExternalProps>>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const stats = selectBookbuildingStats(state, props.eto.etoId);

      return {
        pledgedAmount: stats ? stats.pledgedAmount : null,
        investorsCount: stats ? stats.investorsCount : 0,
      };
    },
  }),
  onEnterAction<IExternalProps & IStateProps>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.bookBuilding.loadBookBuildingStats(props.eto.etoId));
    },
  }),
  setDisplayName("Whitelist"),
)(WhitelistLayout);

export { Whitelist, WhitelistLayout };
