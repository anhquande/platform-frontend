import { branch, compose, renderComponent } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectEtoWithCompanyAndContract } from "../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction.unsafe";
import { withContainer } from "../../utils/withContainer.unsafe";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LayoutBase } from "../layouts/LayoutBase";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView.unsafe";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  previewCode: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

export const EtoPublicView = compose<TProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state),
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEtoPreview(props.previewCode));
    },
  }),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    withContainer(LayoutAuthorized),
    withContainer(LayoutBase),
  ),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
