import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { IBookBuildingStats } from "../../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { actions } from "../../../../modules/actions";
import { selectBookbuildingStats } from "../../../../modules/bookbuilding-flow/selectors";
import {
  selectCanEnableBookBuilding,
  selectIsBookBuilding,
  selectIssuerEtoId,
  selectMaxPledges,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../../utils/OnLeaveAction";
import { EColumnSpan } from "../../../layouts/Container";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Document } from "../../../shared/Document";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import { MoneyNew } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { Panel } from "../../../shared/Panel";

import * as styles from "../../EtoContentWidget.module.scss";

interface IDispatchProps {
  startBookBuilding: (etoId: string) => void;
  stopBookBuilding: (etoId: string) => void;
  downloadCSV: () => void;
}

interface IStateProps {
  bookBuildingEnabled?: boolean;
  bookBuildingStats: IBookBuildingStats;
  maxPledges: number | null;
  etoId: string;
  canEnableBookbuilding: boolean;
  columnSpan?: EColumnSpan;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

interface IBookBuilding {
  bookBuildingStats: IBookBuildingStats;
  downloadCSV: () => void;
  maxPledges: number | null;
}

interface ILayoutProps {
  onClick: () => void;
  headerText: TTranslatedString;
  text: TTranslatedString;
  buttonText: TTranslatedString;
  canEnableBookbuilding: boolean;
  columnSpan?: EColumnSpan;
}

type IProps = IDispatchProps & IStateProps;

const BookBuildingStats = ({ bookBuildingStats, maxPledges, downloadCSV }: IBookBuilding) => (
  <>
    <div className={styles.groupWrapper}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed" />
      </span>
      <span className={styles.value}>
        <MoneyNew
          value={bookBuildingStats.pledgedAmount}
          inputFormat={ENumberInputFormat.FLOAT}
          moneyFormat={ECurrency.EUR}
          outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
        />
      </span>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed" />
      </span>
      <span className={styles.value} data-test-id="eto-bookbuilding-investors-backed">
        {maxPledges !== null ? (
          <FormattedMessage
            id="settings.book-building-stats-widget.number-of-pledges"
            values={{ pledges: bookBuildingStats.investorsCount, maxPledges }}
          />
        ) : null}
      </span>
    </div>
    {bookBuildingStats.investorsCount > 0 ? (
      <DocumentTemplateButton
        onClick={downloadCSV}
        title={<FormattedMessage id="eto-bookbuilding-widget.download-bookbuilding-stats" />}
        altIcon={<Document extension="csv" />}
      />
    ) : null}
  </>
);

const BookBuildingWidgetLayout: React.FunctionComponent<ILayoutProps> = ({
  children,
  onClick,
  headerText,
  text,
  buttonText,
  canEnableBookbuilding,
  columnSpan,
}) => (
  <Panel headerText={headerText} columnSpan={columnSpan}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>
        {canEnableBookbuilding ? (
          text
        ) : (
          <FormattedMessage id="eto-bookbuilding-widget.button-disabled" />
        )}
      </p>
      {children}

      {canEnableBookbuilding && (
        <div className={styles.widgetButton}>
          <ButtonArrowRight
            onClick={onClick}
            data-test-id="eto-flow-start-bookbuilding"
            innerClassName={styles.buttonOverride}
          >
            {buttonText}
          </ButtonArrowRight>
        </div>
      )}
    </div>
  </Panel>
);

export const BookBuildingWidgetComponent: React.FunctionComponent<IProps> = ({
  startBookBuilding,
  bookBuildingEnabled,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV,
  etoId,
  canEnableBookbuilding,
  columnSpan,
}) => {
  if (bookBuildingStats === undefined) {
    //TODO add data loading state
    return <LoadingIndicator className={styles.loading} />;
  } else if (!bookBuildingEnabled && bookBuildingStats.investorsCount === 0) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        text={<FormattedMessage id="settings.book-building-widget.proposal-accepted" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        onClick={() => startBookBuilding(etoId)}
        canEnableBookbuilding={canEnableBookbuilding}
        columnSpan={columnSpan}
      />
    );
  } else if (!bookBuildingEnabled && bookBuildingStats.investorsCount) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-disabled" />}
        text={<FormattedMessage id="settings.book-building-widget.book-building-disabled-text" />}
        buttonText={
          <FormattedMessage id="settings.book-building-widget.reactivate-book-building" />
        }
        onClick={() => startBookBuilding(etoId)}
        canEnableBookbuilding={canEnableBookbuilding}
        columnSpan={columnSpan}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    );
  } else {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-enabled" />}
        text={<FormattedMessage id="settings.book-building-widget.book-building-enabled-text" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.stop-book-building" />}
        onClick={() => stopBookBuilding(etoId)}
        canEnableBookbuilding={canEnableBookbuilding}
        columnSpan={columnSpan}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    );
  }
};

export const BookBuildingWidget = compose<React.FunctionComponent<IExternalProps>>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectIssuerEtoId(state);

      if (!etoId) {
        throw new Error("Eto id is required for bookbuilding");
      }

      return {
        etoId,
        bookBuildingEnabled: selectIsBookBuilding(state),
        bookBuildingStats: selectBookbuildingStats(state, etoId),
        maxPledges: selectMaxPledges(state),
        canEnableBookbuilding: selectCanEnableBookBuilding(state),
      };
    },
    dispatchToProps: dispatch => ({
      startBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(true));
        dispatch(actions.bookBuilding.bookBuildingStartWatch(etoId));
      },
      stopBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(false));
        dispatch(actions.bookBuilding.bookBuildingStopWatch(etoId));
      },
      downloadCSV: () => {
        dispatch(actions.etoFlow.downloadBookBuildingStats());
      },
    }),
  }),
  onEnterAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStartWatch(props.etoId));
      } else {
        dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
      }
    },
  }),
  onLeaveAction<IStateProps>({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStopWatch(props.etoId));
      }
    },
  }),
)(BookBuildingWidgetComponent);
