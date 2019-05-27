import * as cn from "classnames";
import { push } from "connected-react-router";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { selectEtoSubState } from "../../../../modules/eto/selectors";
import { EEtoSubState, TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { FUNDING_ROUNDS } from "../../constants";
import { EProjectStatusType, ETOState } from "../../shared/ETOState";
import { Cover } from "./Cover";
import { EtoCardPanel } from "./EtoCardPanel";
import { EtoStatusManager } from "./EtoStatusManager";

import * as styles from "./EtoOverviewThumbnail.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IDispatchProps {
  navigateToEto: () => void;
}

interface IStateProps {
  etoSubState: EEtoSubState | undefined;
}

interface IWithProps {
  showQuote: boolean;
}

const defaultEmpty = "-";

const EtoOverviewStatusLayout: React.FunctionComponent<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps & IWithProps
> = ({ eto, etoSubState, navigateToEto }) => (
  <EtoCardPanel data-test-id={`eto-overview-${eto.etoId}`} onClick={navigateToEto}>
    <Cover
      className={styles.cover}
      companyBanner={{
        alt: eto.company.brandName,
        srcSet: {
          "1x": eto.company.companyPreviewCardBanner,
        },
      }}
      tags={eto.company.categories}
      jurisdiction={eto.product.jurisdiction}
    />

    <ETOState
      className={styles.statusOfEto}
      previewCode={eto.previewCode}
      type={EProjectStatusType.EXTENDED}
    />

    <section className={styles.content}>
      <Heading titleClassName="text-truncate" decorator={false} level={2} size={EHeadingSize.HUGE}>
        {eto.company.brandName}
      </Heading>

      {etoSubState === EEtoSubState.COMING_SOON ? (
        <p data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
          {eto.company.keyQuoteFounder}
        </p>
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
                {eto.company.companyStage ? FUNDING_ROUNDS[eto.company.companyStage] : defaultEmpty}
              </span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.headquarters" />
              </span>
              <span className={styles.value}>{eto.company.city || defaultEmpty}</span>
            </div>
          </div>

          <EtoStatusManager eto={eto} etoSubState={etoSubState} />
        </>
      )}
    </section>
  </EtoCardPanel>
);

const EtoOverviewThumbnail = compose<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps & IWithProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<IStateProps, IDispatchProps, IExternalProps>({
    stateToProps: (state, props) => ({
      etoSubState: selectEtoSubState(state, props.eto.previewCode),
    }),
    dispatchToProps: (dispatch, { eto }) => ({
      navigateToEto: () =>
        dispatch(push(etoPublicViewLink(eto.previewCode, eto.product.jurisdiction))),
    }),
  }),
)(EtoOverviewStatusLayout);

export { EtoOverviewStatusLayout, EtoOverviewThumbnail };
