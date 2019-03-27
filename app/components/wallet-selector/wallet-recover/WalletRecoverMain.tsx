import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { withContainer } from "../../../utils/withContainer.unsafe";
import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import { LayoutUnauthorized } from "../../layouts/LayoutUnauthorized";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutUnauthorized } from "../../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";
import { RecoverRouter } from "./router/RecoverRouter";

export const WalletRecoverMainComponent: React.FunctionComponent = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col>
        <RecoverRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);

export const WalletRecoverMain: React.FunctionComponent = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
)(WalletRecoverMainComponent);
