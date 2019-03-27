import { compose, lifecycle } from "recompose";

export const layoutEnchancer = compose(
  lifecycle({
    componentDidMount(): void {
      document.body.classList.add("app-body");
    },
    componentWillUnmount(): void {
      document.body.classList.remove("app-body");
    },
  }),
);
