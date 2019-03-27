import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { Form } from "../Form";
import { FormFieldDatePicker } from "./FormFieldDatePicker.unsafe";

storiesOf("Form/FieldDatePicker", module).add("default", () => (
  <Formik initialValues={{}} onSubmit={() => {}}>
    {() => (
      <Form>
        <FormFieldDatePicker name="name" />
      </Form>
    )}
  </Formik>
));
