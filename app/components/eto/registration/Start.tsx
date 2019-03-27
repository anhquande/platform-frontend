import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction.unsafe";
import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

interface IStateProps {
  isLoading: boolean;
}

export const EtoRegisterComponent: React.FunctionComponent<IStateProps> = ({ isLoading }) => (
  <LayoutAuthorized>{isLoading ? <LoadingIndicator /> : <EtoRegistrationPanel />}</LayoutAuthorized>
);

export const EtoRegister = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadIssuerEto()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: s.etoFlow.loading,
    }),
  }),
)(EtoRegisterComponent);
