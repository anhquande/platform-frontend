import * as React from "react";
import { connect } from "react-redux";
import { withProps } from "recompose";
import { compose } from "redux";

import { AppDispatch } from "../store";

interface IOnEnterActionDispatchProps {
  enterAction: Function;
}

interface IOnEnterActionStateProps {
  wrappedComponent: React.ComponentType;
}

interface IOnEnterActionOptions<P = {}> {
  actionCreator: (dispatch: AppDispatch, props: P) => void;
  pure?: boolean;
}

class OnEnterAction extends React.Component<
  IOnEnterActionStateProps & IOnEnterActionDispatchProps
> {
  componentDidMount(): void {
    this.props.enterAction();
  }

  render(): React.ReactNode {
    const { enterAction, ...componentProps } = this.props;
    return <this.props.wrappedComponent {...componentProps} />;
  }
}

export const onEnterAction = <P extends object = {}>(options: IOnEnterActionOptions<P>) => (
  wrappedComponent: React.ComponentType,
) =>
  compose<React.ComponentClass>(
    connect<{}, IOnEnterActionDispatchProps, P>(
      undefined,
      (dispatch, props) => ({
        enterAction: () => options.actionCreator(dispatch, props),
      }),
      undefined,
      {
        pure: options.pure,
      },
    ),
    withProps<IOnEnterActionStateProps, IOnEnterActionStateProps>({
      wrappedComponent,
    }),
  )(OnEnterAction);
