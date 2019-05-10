import * as React from "react";
import { RouteProps } from "react-router-dom";
import { branch, compose, renderNothing } from "recompose";

import { actions } from "../../../modules/actions";
import { selectIsAuthorized } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";

interface IStateProps {
  isAuthorized: boolean;
}

interface IComponentProps {
  isAuthorized: boolean;
  component: any;
}

const OnlyPublicRouteComponent: React.FunctionComponent<IComponentProps> = ({
  component: Component,
  ...rest
}) => <Component {...rest} />;

export const OnlyPublicRoute = compose<IComponentProps, RouteProps>(
  appConnect<IStateProps, {}, RouteProps>({
    stateToProps: s => ({
      isAuthorized: selectIsAuthorized(s.auth),
    }),
  }),
  onEnterAction({
    //dispatch is typed as any in the source, sorry
    actionCreator: (dispatch: any, props: IStateProps) => {
      if (props.isAuthorized) {
        dispatch(actions.routing.goToDashboard());
      }
    },
  }),
  branch<IStateProps & RouteProps>(state => state.component === undefined, renderNothing),
)(OnlyPublicRouteComponent);
