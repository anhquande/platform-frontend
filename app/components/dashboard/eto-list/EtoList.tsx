import * as React from "react";
import { Col } from "reactstrap";
import { compose } from "redux";

import { TInvestorEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TInvestorEtoData[];
}

interface IDispatchProps {
  startInvestmentFlow: (eto: TInvestorEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

// TODO: Invest button needs to go to details view later
export const EtoListComponent: React.SFC<IProps> = ({ etos, startInvestmentFlow }) => (
  <>
    <Col xs={12}>
      <SectionHeader>ETO Offerings</SectionHeader>
    </Col>
    {etos.map((eto, index) => (
      <Col xs={12} lg={6} key={index}>
        {/* TODO: implement real ETO Card here */}
        <div className="mb-3">
          <h4>{eto.company.brandName}</h4>
          <Button onClick={() => startInvestmentFlow(eto)}>invest now</Button>
        </div>
      </Col>
    ))}
  </>
);

export const EtoList = compose<React.ComponentClass>(
  onEnterAction({
    actionCreator: d => d(actions.dashboard.loadEtos()),
  }),
  appConnect({
    stateToProps: state => ({
      etos: state.dashboard.etos,
    }),
    dispatchToProps: _d => ({
      startInvestmentFlow: () => {},
    }),
  }),
)(EtoListComponent);
