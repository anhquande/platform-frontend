import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../../../modules/actions";
import { selectIsInvestor } from "../../../../../modules/auth/selectors";
import { selectEtoOnChainNextStateStartDate } from "../../../../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../../../modules/eto/types";
import { selectIsUserVerifiedOnBlockchain } from "../../../../../modules/kyc/selectors";
import { appConnect } from "../../../../../store";
import { appRoutes } from "../../../../appRoutes";
import { etoPublicViewLink } from "../../../../appRouteUtils";
import { Button, ButtonLink } from "../../../../shared/buttons";
import { MoneyNew } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
import { EtoWidgetContext } from "../../../EtoWidgetView";
import { EndTimeWidget } from "../EndTimeWidget";
import { InvestmentProgress } from "./InvestmentProgress";

import * as styles from "./InvestmentWidget.module.scss";

export interface IInvestmentWidgetProps {
  eto: TEtoWithCompanyAndContract;
}

export interface IInvestmentWidgetStateProps {
  isAllowedToInvest: boolean;
  isInvestor: boolean;
  nextStateDate: Date | undefined;
}

export interface IInvestmentWidgetDispatchProps {
  startInvestmentFlow: () => void;
}
export type TInvestWidgetProps = IInvestmentWidgetProps &
  IInvestmentWidgetStateProps &
  IInvestmentWidgetDispatchProps;

const InvestmentWidgetLayout: React.FunctionComponent<TInvestWidgetProps> = ({
  startInvestmentFlow,
  eto,
  isInvestor,
  isAllowedToInvest,
  nextStateDate,
}) => {
  const totalInvestors = eto.contract!.totalInvestment.totalInvestors;

  return (
    <div className={styles.investmentWidget}>
      <div>
        <div className={styles.header}>
          <div>
            <MoneyNew
              value={eto.contract!.totalInvestment.etherTokenBalance}
              inputFormat={ENumberInputFormat.ULPS}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              moneyFormat={ECurrency.ETH}
            />
            <br />
            <MoneyNew
              value={eto.contract!.totalInvestment.euroTokenBalance}
              inputFormat={ENumberInputFormat.ULPS}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              moneyFormat={ECurrency.EUR_TOKEN}
            />
          </div>
          {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && (
            <div>
              <FormattedMessage
                id="shared-component.eto-overview.investors"
                values={{ totalInvestors }}
              />
            </div>
          )}
        </div>
        <InvestmentProgress eto={eto} />
      </div>
      <EtoWidgetContext.Consumer>
        {previewCode =>
          (isInvestor || previewCode) && (
            <div className={styles.investNowButton}>
              {previewCode ? (
                <ButtonLink
                  to={etoPublicViewLink(previewCode, eto.product.jurisdiction)}
                  target="_blank"
                  data-test-id="eto-widget-invest-now-button"
                >
                  <FormattedMessage id="shared-component.eto-overview.invest-now" />
                </ButtonLink>
              ) : isAllowedToInvest ? (
                <Button
                  onClick={startInvestmentFlow}
                  data-test-id={`eto-invest-now-button-${eto.etoId}`}
                >
                  <FormattedMessage id="shared-component.eto-overview.invest-now" />
                </Button>
              ) : (
                <ButtonLink
                  to={appRoutes.profile}
                  data-test-id="eto-overview-settings-update-required-to-invest"
                >
                  <FormattedMessage id="shared-component.eto-overview.settings-update-required" />
                </ButtonLink>
              )}
              <EndTimeWidget endTime={nextStateDate} />
            </div>
          )
        }
      </EtoWidgetContext.Consumer>
    </div>
  );
};

const InvestmentWidget = compose<TInvestWidgetProps, IInvestmentWidgetProps>(
  appConnect<IInvestmentWidgetStateProps, IInvestmentWidgetDispatchProps, IInvestmentWidgetProps>({
    stateToProps: (state, props) => ({
      isAllowedToInvest: selectIsUserVerifiedOnBlockchain(state),
      isInvestor: selectIsInvestor(state),
      nextStateDate: selectEtoOnChainNextStateStartDate(state, props.eto.previewCode),
    }),
    dispatchToProps: (dispatch, props) => ({
      startInvestmentFlow: () => dispatch(actions.investmentFlow.startInvestment(props.eto.etoId)),
    }),
  }),
)(InvestmentWidgetLayout);

export { InvestmentWidget };
