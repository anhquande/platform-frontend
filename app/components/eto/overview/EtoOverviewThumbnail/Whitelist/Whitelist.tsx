import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName, withProps } from "recompose";
import { compose } from "redux";

import { actions } from "../../../../../modules/actions";
import { selectBookbuildingStats } from "../../../../../modules/bookbuilding-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../../../../modules/eto/types";
import { appConnect } from "../../../../../store";
import { onEnterAction } from "../../../../../utils/OnEnterAction";
import { CounterWidget } from "../CounterWidget";
import { WhitelistStatus } from "./WhitelistStatus";

import * as styles from "../EtoStatusManager.module.scss";

export interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
  nextStateStartDate: Date;
}

interface IStateProps {
  pledgedAmount: number | null;
  investorsCount: number;
}

interface IWithProps {
  isInvestorsLimitReached: boolean;
}

type IProps = IWithProps & IExternalProps & IStateProps;

const WhitelistLayout: React.FunctionComponent<IProps> = ({
  eto,
  pledgedAmount,
  investorsCount,
  isInvestorsLimitReached,
  nextStateStartDate,
}) => {
  if (eto.isBookbuilding && !isInvestorsLimitReached) {
    return (
      <>
        <WhitelistStatus
          pledgedAmount={pledgedAmount}
          investorsCount={investorsCount}
          investorsLimit={eto.maxPledges}
        />

        <p className={styles.info}>
          <FormattedMessage id="eto-overview-thumbnail.whitelist.is-open" />
        </p>
      </>
    );
  }

  return <CounterWidget endDate={nextStateStartDate} />;
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
  withProps<IWithProps, IStateProps & IExternalProps>(({ eto, investorsCount }) => ({
    isInvestorsLimitReached: investorsCount >= eto.maxPledges,
  })),
  setDisplayName("Whitelist"),
)(WhitelistLayout);

export { Whitelist, WhitelistLayout };
