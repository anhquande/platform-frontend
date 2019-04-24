import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../modules/actions";
import { selectPublicEtos } from "../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { RequiredByKeys } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { EtosComingSoon } from "../../eto/overview/EtoOverviewStatus/EtosComingSoon";
import { EtoOverviewThumbnail } from "../../eto/overview/EtoOverviewThumbnail";
import { Heading } from "../../shared/Heading";
import { ELoadingIndicator, LoadingIndicator } from "../../shared/loading-indicator";

import * as styles from "./EtoList.module.scss";

interface IStateProps {
  etos?: TEtoWithCompanyAndContract[];
}

type TListProps = RequiredByKeys<IStateProps, "etos">;

const EtoListThumbnails: React.FunctionComponent<TListProps> = ({ etos }) => (
  <Row>
    {etos.map(eto => (
      <Col className="mb-4" xs={12} sm={6} lg={4} key={eto.previewCode}>
        <EtoOverviewThumbnail eto={eto} />
      </Col>
    ))}
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
      <Heading level={3}>
        <FormattedMessage id="dashboard.eto-opportunities" />
      </Heading>
    </Col>
    <Col xs={12}>
      <p className={styles.opportunitiesDescription}>
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
      d(actions.publicEtos.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectPublicEtos(state),
    }),
  }),
)(EtoListComponent);
