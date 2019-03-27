import { branch, compose, renderComponent } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContractById } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction.unsafe";
import { withContainer } from "../../utils/withContainer.unsafe";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LayoutBase } from "../layouts/LayoutBase";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { ErrorBoundaryLayoutBase } from "../shared/errorBoundary/ErrorBoundaryLayoutBase";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView.unsafe";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  etoId: string;
}

interface IDispatchProps {
  loadEto: () => void;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

export const EtoPublicViewByContractId = compose<TProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state),
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId));
    },
  }),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    createErrorBoundary(ErrorBoundaryLayoutAuthorized),
    createErrorBoundary(ErrorBoundaryLayoutBase),
  ),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    withContainer(LayoutAuthorized),
    withContainer(LayoutBase),
  ),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
