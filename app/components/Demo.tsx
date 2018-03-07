import * as React from "react";
import { Col, Container, FormFeedback, FormGroup, Input, Row } from "reactstrap";

import * as styles from "./Demo.module.scss";

import {
  ButtonPrimary,
  ButtonPrimaryLink,
  ButtonSecondary,
  ButtonSecondaryLink,
} from "./shared/Buttons";
import { NavigationButton, NavigationLink } from "./shared/Navigation";
import { PanelDark } from "./shared/PanelDark";
import { PanelWhite } from "./shared/PanelWhite";

export const Demo: React.SFC = () => (
  <div className={styles.demoWrapper}>
    <Container>
      <Row>
        <Col>
          <ButtonPrimary>ButtonPrimary</ButtonPrimary>
          <ButtonPrimary disabled>ButtonPrimary disabled</ButtonPrimary>
          <ButtonPrimaryLink to="/">ButtonPrimaryLink</ButtonPrimaryLink>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <ButtonSecondary>ButtonSecondary</ButtonSecondary>
          <ButtonSecondary disabled>ButtonSecondary disabled</ButtonSecondary>
          <ButtonSecondaryLink to="/">ButtonSecondary link</ButtonSecondaryLink>
        </Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col>
          <a href="/">link</a>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <NavigationButton forward text="NavigationButton" onClick={() => {}} />
          <NavigationButton disabled forward text="NavigationButton disabled" onClick={() => {}} />
          <NavigationLink forward to="/" text="NavigationLink" />
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Input placeholder={"This form is always invalid"} valid={false} />
            <FormFeedback>invalid</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <PanelDark
            headerText="header text"
            rightComponent={
              <span style={{ height: "40px", backgroundColor: "red" }}>right component</span>
            }
          >
            <p>So this is our dark panel. It can contain React.Nodes as children and two props:</p>
            <dl>
              <dt>headerText: string</dt>
              <dd>Title of panel it will be rendered in span element</dd>
              <dt>rightComponent: ReactNode</dt>
              <dd>Component that will be put in header on right side.</dd>
            </dl>
          </PanelDark>
        </Col>
      </Row>
    </Container>

    <Container>
      <Row>
        <Col>
          <PanelWhite>
            <p className="mt-2">
              So this is our white panel. It can contain React.Nodes as children and no Props:
            </p>
            <dl>
              <dt>headerText: string</dt>
              <dd>Title of panel it will be rendered in span element</dd>
              <dt>rightComponent: ReactNode</dt>
              <dd>Component that will be put in header on right side.</dd>
            </dl>
          </PanelWhite>
        </Col>
      </Row>
    </Container>
  </div>
);