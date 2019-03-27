import * as cn from "classnames";
import * as React from "react";
import { Tooltip, TooltipProps } from "reactstrap";

import * as styles from "./CustomTooltip.module.scss";

interface IProps {}
interface IState {
  tooltipOpen: boolean;
}

export class CustomTooltip extends React.Component<TooltipProps & IProps> {
  state: IState = {
    tooltipOpen: false,
  };

  toggle = () => {
    if (!this.props.isOpen) {
      this.setState((s: IState) => ({ tooltipOpen: !s.tooltipOpen }));
    }
  };

  componentDidMount(): void {
    if (this.props.isOpen) {
      this.setState({
        tooltipOpen: true,
      });
    }
  }

  componentDidCatch(error: any, info: any): void {
    // this function should not be called, but just in case
    // if some errors occure, it will not crash the whole application any more
    // prevents a reactstrap tooltip bug where target dom node is not found

    // tslint:disable-next-line:no-console
    console.error(error, info);
    // trigger a rerender to update current dom
    // this prevents errors where the id in the target dom node has changed dynamically
    this.setState({ tooltipOpen: this.state.tooltipOpen });
  }

  render(): React.ReactChild {
    const { target, className, isOpen, toggle, children, ...props } = this.props;
    return (
      <Tooltip
        className={cn(styles.tooltip, className)}
        target={target}
        autohide={false}
        isOpen={this.state.tooltipOpen}
        toggle={toggle || this.toggle}
        {...props}
      >
        {children}
      </Tooltip>
    );
  }
}
