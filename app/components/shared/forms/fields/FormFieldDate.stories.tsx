import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { Form } from "../Form";
import { FormFieldDate } from "./FormFieldDate.unsafe";

storiesOf("Form/FieldDate", module).add("default", () => (
  <Formik initialValues={{}} onSubmit={() => {}}>
    {() => (
      <Form>
        <FormFieldDate label="Date of birth" name="dob" />
      </Form>
    )}
  </Formik>
));
