import * as cn from "classnames";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";

import * as styles from "./LayoutRegisterLogin.module.scss";

const LayoutRegisterLogin: React.FunctionComponent = ({ children }) => (
  <Container>
    <Row>
      <Col
        lg="12"
        xl={{ size: 10, offset: 1 }}
        className={cn("p-4", styles.mainContainer)}
        data-test-id="register-layout"
      >
        {/* TODO: Removed after enzyme adds support for React.Suspense */}
        {process.env.NF_IS_MOCHA === "1" ? (
          children
        ) : (
          <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
        )}
      </Col>
    </Row>
  </Container>
);

export { LayoutRegisterLogin };
