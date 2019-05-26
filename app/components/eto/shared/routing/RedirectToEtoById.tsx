import * as React from "react";
import { Redirect } from "react-router";
import { branch, compose, renderComponent } from "recompose";

import { EUserType } from "../../../../lib/api/users/interfaces";
import { actions } from "../../../../modules/actions";
import { selectUserType } from "../../../../modules/auth/selectors";
import { selectEtoWithCompanyAndContractById } from "../../../../modules/eto/selectors";
import { TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { etoPublicViewByIdLink } from "../../../appRouteUtils";
import { LayoutAuthorized } from "../../../layouts/LayoutAuthorized";
import { LayoutBase } from "../../../layouts/LayoutBase";
import { LoadingIndicator } from "../../../shared/loading-indicator";

interface IStateProps {
  eto?: TEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  etoId: string;
}

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

const RedirectEtoByIdComponent: React.FunctionComponent<TProps> = ({ eto }) => (
  <Redirect to={etoPublicViewByIdLink(eto.etoId, eto.product.jurisdiction)} />
);
export const RedirectEtoById = compose<TProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state),
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
    }),
  }),
  onEnterAction<IRouterParams>({
    actionCreator: (dispatch, props) => {
      dispatch(actions.eto.loadEto(props.etoId));
    },
  }),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    withContainer(LayoutAuthorized),
    withContainer(LayoutBase),
  ),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(RedirectEtoByIdComponent);
