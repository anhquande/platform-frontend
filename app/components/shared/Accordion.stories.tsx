import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Accordion, AccordionElement } from "./Accordion.unsafe";

const lorem =
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut unde soluta vero ab magnam sit, libero id veniam? Porro, cupiditate dignissimos. Neque ratione fugit doloremque, explicabo molestias impedit minima dicta.";

storiesOf("Basic UI/Accordion", module)
  .add("default", () => (
    <Accordion>
      <AccordionElement title="Accordion title 1">
        <p>{lorem}</p>
      </AccordionElement>
      <AccordionElement title="Accordion title 2">
        <p>{lorem}</p>
      </AccordionElement>
    </Accordion>
  ))
  .add("opened", () => (
    <Accordion>
      <AccordionElement title="Accordion title 1" isOpened={true}>
        <p>{lorem}</p>
      </AccordionElement>
      <AccordionElement title="Accordion title 2">
        <p>{lorem}</p>
      </AccordionElement>
    </Accordion>
  ));
