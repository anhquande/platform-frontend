import * as cn from "classnames";
import { push } from "connected-react-router";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { EEtoState } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { selectIsEligibleToPreEto } from "../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { Panel } from "../../../shared/Panel";
import { FUNDING_ROUNDS } from "../../constants";
import { ETOState } from "../../shared/ETOState";
import { Cover } from "./Cover";
import { EtoStatusManager } from "./EtoStatusManager";

import * as styles from "./EtoOverviewThumbnail.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IStatusOfEto {
  previewCode: string;
}

interface IDispatchProps {
  navigateToEto: () => void;
}

interface IStateProps {
  isEligibleToPreEto: boolean;
}

interface IWithProps {
  showQuote: boolean;
}

const defaultEmpty = "-";

const StatusOfEto: React.FunctionComponent<IStatusOfEto> = ({ previewCode }) => (
  <ETOState className={styles.statusOfEto} previewCode={previewCode} />
);

const EtoOverviewStatusLayout: React.FunctionComponent<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps & IWithProps
> = ({ eto, isEligibleToPreEto, navigateToEto, showQuote }) => (
  // TODO: Refactor to use ButtonLink
  <div onClick={navigateToEto}>
    <Panel data-test-id={`eto-overview-${eto.etoId}`} className={styles.panel}>
      <Cover
        className={styles.cover}
        companyBanner={{
          alt: eto.company.brandName,
          srcSet: {
            "1x": eto.company.companyBanner!,
          },
        }}
        tags={eto.company.categories}
        jurisdiction={eto.product.jurisdiction}
      />

      <StatusOfEto previewCode={eto.previewCode} />

      <section className={styles.content}>
        <Heading decorator={false} level={2} size={EHeadingSize.HUGE}>
          {eto.company.brandName}
        </Heading>

        {showQuote ? (
          <div data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
            {eto.company.keyQuoteFounder}
          </div>
        ) : (
          <>
            <div className={cn(styles.groupWrapper)}>
              <div className={styles.group}>
                <span className={styles.label}>
                  <FormattedMessage id="eto-overview-thumbnail.token-name" />
                </span>
                <span className={styles.value}>
                  {eto.equityTokenName} ({eto.equityTokenSymbol})
                </span>
              </div>

              <div className={styles.group}>
                <span className={styles.label}>
                  <FormattedMessage id="eto-overview-thumbnail.funding-round" />
                </span>
                <span className={styles.value}>
                  {eto.company.companyStage
                    ? FUNDING_ROUNDS[eto.company.companyStage]
                    : defaultEmpty}
                </span>
              </div>

              <div className={styles.group}>
                <span className={styles.label}>
                  <FormattedMessage id="eto-overview-thumbnail.headquarters" />
                </span>
                <span className={styles.value}>{eto.company.city || defaultEmpty}</span>
              </div>
            </div>

            <EtoStatusManager eto={eto} isEligibleToPreEto={isEligibleToPreEto} />
          </>
        )}
      </section>
    </Panel>
  </div>
);

const EtoOverviewThumbnail = compose<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps & IWithProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<IStateProps, IDispatchProps, IExternalProps>({
    stateToProps: (state, props) => ({
      isEligibleToPreEto: selectIsEligibleToPreEto(state, props.eto.etoId),
    }),
    dispatchToProps: (dispatch, { eto }) => ({
      navigateToEto: () =>
        dispatch(push(withParams(appRoutes.etoPublicView, { previewCode: eto.previewCode }))),
    }),
  }),
  withProps<IWithProps, IStateProps & IExternalProps>(({ isEligibleToPreEto, eto }) => {
    const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;
    const showQuote =
      eto.state !== EEtoState.ON_CHAIN || eto.contract!.startOfStates[nextState] === undefined;

    return { showQuote };
  }),
)(EtoOverviewStatusLayout);

export { EtoOverviewStatusLayout, EtoOverviewThumbnail };
