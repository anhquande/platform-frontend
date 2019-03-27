import { throttle } from "lodash";
import * as React from "react";

interface IProps {
  condition: (y: number) => boolean;
  children: (visible: boolean) => React.ReactNode;
  onHide?: () => any;
}

interface IState {
  isInTarget: boolean;
}

export class ScrollSpy extends React.Component<IProps, IState> {
  state: IState = {
    isInTarget: false,
  };

  render(): React.ReactNode {
    return this.props.children(this.state.isInTarget);
  }

  componentDidMount(): void {
    window.addEventListener("scroll", this.scrollSpy);
  }

  componentWillUnmount(): void {
    window.removeEventListener("scroll", this.scrollSpy);
  }

  private scrollSpy = throttle(() => {
    const newIsInTarget = this.props.condition(window.scrollY);

    if (newIsInTarget !== this.state.isInTarget) {
      this.setState({
        isInTarget: newIsInTarget,
      });

      if (!newIsInTarget && this.props.onHide) {
        this.props.onHide();
      }
    }
  }, 50);
}
