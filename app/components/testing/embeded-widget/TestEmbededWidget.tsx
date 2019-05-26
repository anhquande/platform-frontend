import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import {
  selectEtoWidgetError,
  selectEtoWithCompanyAndContractById,
} from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { etoWidgetViewLink } from "../../appRouteUtils";

interface IStateProps {
  eto: TEtoWithCompanyAndContract | undefined;
  widgetError: boolean | undefined;
}

interface IRouterParams {
  etoId: string;
}

const TestEmbededWidgetLayout: React.FunctionComponent<IStateProps> = ({ eto, widgetError }) => (
  <>
    <h3>Eto widget testing page</h3>
    {eto && eto.previewCode && (
      <iframe width="100%" height={215} src={etoWidgetViewLink(eto.previewCode)} />
    )}

    {widgetError && <iframe width="100%" height={215} src={etoWidgetViewLink("error-id")} />}
  </>
);

const TestEmbededWidget = compose<IStateProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams & IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
      widgetError: selectEtoWidgetError(state.eto),
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEto(props.etoId, true));
    },
  }),
)(TestEmbededWidgetLayout);

export { TestEmbededWidget };
