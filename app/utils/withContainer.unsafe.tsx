import * as React from "react";
import { ComponentEnhancer, nest } from "recompose";

export function withContainer(Layout: React.ComponentType<any>): ComponentEnhancer<any, any> {
  return WrapperComponent => nest(Layout, WrapperComponent);
}
