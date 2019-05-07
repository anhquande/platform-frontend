import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { testEto, testProduct } from "../../../../../test/fixtures";
import { TEtoProducts } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { noopLogger } from "../../../../lib/dependencies/logger";
import { Panel } from "../../../shared/Panel";
import { EtoRegistrationTermsLayout } from "./EtoTerms";

const availableProducts: TEtoProducts = [testProduct];

storiesOf("EtoTerms", module)
  .addDecorator(story => <Panel>{story()}</Panel>)
  .add("default", () => (
    <Formik initialValues={testEto} onSubmit={action("onSubmit")}>
      {props => (
        <EtoRegistrationTermsLayout
          availableProducts={availableProducts}
          changeProductType={action("changeProductType")}
          eto={testEto}
          savingData={false}
          readonly={false}
          saveData={action("saveData")}
          logger={noopLogger}
          {...props}
        />
      )}
    </Formik>
  ));
