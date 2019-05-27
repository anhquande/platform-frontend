import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../modules/actions";
import { selectEtos } from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { RequiredByKeys } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { EtosComingSoon } from "../../eto/overview/EtoOverviewStatus/EtosComingSoon";
import { EtosComingSoonThumbnail } from "../../eto/overview/EtoOverviewStatus/EtosComingSoonThumbnail";
import { EtoOverviewThumbnail } from "../../eto/overview/EtoOverviewThumbnail";
import { DashboardHeading } from "../../eto/shared/DashboardHeading";
import { ELoadingIndicator, LoadingIndicator } from "../../shared/loading-indicator";

interface IStateProps {
  etos?: TEtoWithCompanyAndContract[];
}

type TListProps = RequiredByKeys<IStateProps, "etos">;

const EtoListThumbnails: React.FunctionComponent<TListProps> = ({ etos }) => (
  <Row>
    {etos.map(eto => (
      <Col className="mb-4" xs={12} md={6} lg={4} key={eto.previewCode}>
        <EtoOverviewThumbnail eto={eto} />
      </Col>
    ))}

    {etos.length < 4 && <EtosComingSoonThumbnail />}
  </Row>
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
    <Col xs={12}>
      <DashboardHeading title={<FormattedMessage id="dashboard.eto-opportunities" />} />
      <p>
        <FormattedMessage id="dashboard.eto-opportunities.description" />
      </p>
    </Col>
    <Col xs={12}>
      {etos ? (
        process.env.NF_ETO_LIST_GRID === "1" ? (
          <EtoListThumbnails etos={etos} />
        ) : (
          <EtoListDefault etos={etos} />
        )
      ) : (
        <LoadingIndicator type={ELoadingIndicator.HEXAGON} />
      )}
    </Col>
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
