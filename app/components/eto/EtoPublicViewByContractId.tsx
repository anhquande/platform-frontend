import { branch, compose, renderComponent } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContractById } from "../../modules/eto/selectors";
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
  etoId: string;
  jurisdiction: string;
}

interface IDispatchProps {
  loadEto: () => void;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
  isInvestorView: boolean;
};

export const EtoPublicViewByContractId = compose<TProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state),
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
      isInvestorView: true,
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEto(props.etoId));
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
