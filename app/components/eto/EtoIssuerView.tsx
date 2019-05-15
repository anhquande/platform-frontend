import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectIssuerEtoWithCompanyAndContract } from "../../modules/eto-flow/selectors";
import { selectEtoWithCompanyAndContract } from "../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { MultiEtoView } from "./shared/EtoView";

type TProps = {
  eto: TEtoWithCompanyAndContract;
  etoPreview: TEtoWithCompanyAndContract;
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
    stateToProps: state => {
      const eto = selectIssuerEtoWithCompanyAndContract(state);

      return {
        eto,
        etoPreview: eto && selectEtoWithCompanyAndContract(state, eto.previewCode),
      };
    },
  }),
  withContainer(LayoutAuthorized),
  branch<TStateProps>(props => !props.eto || !props.etoPreview, renderComponent(LoadingIndicator)),
)(MultiEtoView);
