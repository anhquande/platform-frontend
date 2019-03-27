import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { selectIsAuthorized } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { appRoutes } from "../../appRoutes";

interface IStateProps {
  isAuthorized: boolean;
}

interface IComponentProps {
  isAuthorized: boolean;
  component: any;
}

type TProps = RouteProps & IStateProps;

const OnlyPublicRouteRedirectComponent: React.FunctionComponent<TProps> = props => {
  return <Route {...props} render={() => <Redirect to={appRoutes.dashboard} />} />;
};

const OnlyPublicRouteComponent: React.FunctionComponent<IComponentProps> = ({
  component: Component,
  ...rest
}) => {
  return <Component {...rest} />;
};

export const OnlyPublicRoute = compose<IComponentProps, RouteProps>(
  appConnect<IStateProps, {}, RouteProps>({
    stateToProps: s => ({
      isAuthorized: selectIsAuthorized(s.auth),
    }),
  }),
  branch<IStateProps>(
    state => state.isAuthorized,
    renderComponent(OnlyPublicRouteRedirectComponent),
  ),
  branch<IStateProps & RouteProps>(state => state.component === undefined, renderNothing),
)(OnlyPublicRouteComponent);
