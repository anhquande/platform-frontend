import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../modules/actions";
import { selectEtos } from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { RequiredByKeys } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { EtosComingSoon } from "../../eto/overview/EtoOverviewStatus/EtosComingSoon";
import { EtoOverviewThumbnail } from "../../eto/overview/EtoOverviewThumbnail/EtoOverviewThumbnail";
import { DashboardHeading } from "../../eto/shared/DashboardHeading";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { ELoadingIndicator, LoadingIndicator } from "../../shared/loading-indicator";

import * as styles from "./EtoList.module.scss";

interface IStateProps {
  etos?: TEtoWithCompanyAndContract[];
}

type TListProps = RequiredByKeys<IStateProps, "etos">;

const EtoListThumbnails: React.FunctionComponent<TListProps> = ({ etos }) => (
  <Container type={EContainerType.INHERIT_GRID} className={styles.progressSectionLayout}>
    {etos.map(eto => (
      <EtoOverviewThumbnail eto={eto} key={eto.previewCode} />
    ))}
  </Container>
);

const EtoListDefault: React.FunctionComponent<TListProps> = ({ etos }) => (
  <>
    {etos.map(eto => (
      <div className="mb-3" key={eto.previewCode}>
        <EtoOverviewStatus eto={eto} />
      </div>
    ))}
    {etos.length < 4 && <EtosComingSoon />}
  </>
);

const EtoListComponent: React.FunctionComponent<IStateProps> = ({ etos }) => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardHeading title={<FormattedMessage id="dashboard.eto-opportunities" />} />
      <p>
        <FormattedMessage id="dashboard.eto-opportunities.description" />
      </p>
    </Container>

    {etos ? (
      process.env.NF_ETO_LIST_GRID === "1" ? (
        <EtoListThumbnails etos={etos} />
      ) : (
        <EtoListDefault etos={etos} />
      )
    ) : (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator type={ELoadingIndicator.HEXAGON} />
      </Container>
    )}
  </>
);

export const EtoList = compose<IStateProps, {}>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.loadWalletData());
      d(actions.eto.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectEtos(state),
    }),
  }),
)(EtoListComponent);
