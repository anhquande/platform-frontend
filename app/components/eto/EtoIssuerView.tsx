import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectIssuerEtoWithCompanyAndContract } from "../../modules/eto-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView.unsafe";

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

type TStateProps = Partial<TProps>;

export const EtoIssuerView = compose<TProps, {}>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadIssuerEto());
    },
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      eto: selectIssuerEtoWithCompanyAndContract(state),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch<TStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
