import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EEtoMarketingDataVisibleInPreview } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { PublishETOWidgetComponent } from "./PublishETOWidget";

storiesOf("PublishETOWidget", module)
  .add("default", () => <PublishETOWidgetComponent publish={() => action("PUBLISH")} />)
  .add("pending", () => (
    <PublishETOWidgetComponent
      publish={() => action("PUBLISH")}
      isMarketingDataVisibleInPreview={EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING}
    />
  ));
