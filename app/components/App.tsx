import * as React from "react";
import { ToastContainer } from "react-toastify";

import { compose } from "redux";
import { actions } from "../modules/actions";
import {
  selectInitError,
  selectIsInitDone,
  selectIsInitInProgress,
} from "../modules/init/selectors";
import { appConnect } from "../store";
import { onEnterAction } from "../utils/OnEnterAction";
import { AppRouter } from "./AppRouter";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { GenericModal } from "./modals/GenericModal";
import { AccessWalletModal } from "./modals/walletAccess/AccessWalletModal";
import { LoadingIndicator } from "./shared/LoadingIndicator";
import { ScrollToTop } from "./shared/ScrollToTop";

interface IStateProps {
  inProgress: boolean;
  done: boolean;
  error?: string;
}

class AppComponent extends React.Component<IStateProps> {
  render(): React.ReactNode {
    if (this.props.error) {
      return <h1>Critical error occured: {this.props.error}</h1>;
    }

    if (this.props.inProgress) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <Header />
        <div className="wrapper">
          <ScrollToTop>
            <AppRouter />
          </ScrollToTop>
        </div>
        <Footer />
        <AccessWalletModal />
        <ToastContainer />
        <GenericModal />
      </>
    );
  }
}

export const App = compose<React.ComponentClass>(
  onEnterAction({
    actionCreator: d => d(actions.init.start("appInit")),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      inProgress: selectIsInitInProgress(s.init),
      done: selectIsInitDone(s.init),
      error: selectInitError(s.init),
    }),
    options: { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
  }),
)(AppComponent);
