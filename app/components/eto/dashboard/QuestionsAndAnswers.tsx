import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { Accordion, AccordionElement } from "../../shared/Accordion";
import { Panel } from "../../shared/Panel";

interface IquestionAndAnswer {
  question: string;
  answer: string;
}

interface IProps {
  questionsAndAnswers: IquestionAndAnswer[];
}

export const QuestionsAndAnswers: React.SFC<IProps> = ({ questionsAndAnswers }) => {
  return (
    <Panel>
      <Container>
        <Row>
          <Col>
            <Accordion>
              {questionsAndAnswers.map(({ question, answer }) => (
                <AccordionElement title={question} key={question}>
                  <p>{answer}</p>
                </AccordionElement>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </Panel>
  );
};
