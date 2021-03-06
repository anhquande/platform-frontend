import { branch, compose, renderComponent } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContract } from "../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LayoutBase } from "../layouts/LayoutBase";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { ErrorBoundaryLayoutBase } from "../shared/errorBoundary/ErrorBoundaryLayoutBase";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";
import { withJurisdictionDisclaimer } from "./shared/routing/withJurisdictionDisclaimer";
import { withJurisdictionRoute } from "./shared/routing/withJurisdictionRoute";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  previewCode: string;
  jurisdiction: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
  isInvestorView: boolean;
};

export const EtoPublicView = compose<TProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state),
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
      isInvestorView: true,
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEtoPreview(props.previewCode));
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
  withJurisdictionDisclaimer<TProps>(props => props.eto.previewCode),
  withJurisdictionRoute<TProps & IRouterParams>(props => ({
    previewCode: props.eto.previewCode,
    jurisdiction: props.jurisdiction,
  })),
)(EtoView);
