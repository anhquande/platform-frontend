import { isEqual } from "lodash/fp";
import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { ButtonIcon } from "./buttons";
import { SlidePerson } from "./SlidePerson";
import { IEtoSocialProfile } from "./SocialProfilesList";

import * as prevIcon from "../../assets/img/inline_icons/arrow_bordered_left.svg";
import * as nextIcon from "../../assets/img/inline_icons/arrow_bordered_right.svg";
import * as styles from "./PeopleSwiperWidget.module.scss";

export interface IPerson {
  name: string;
  image: string;
  description: string;
  role: string;
  socialChannels: IEtoSocialProfile[];
  website?: string;
}

interface IOwnProps {
  people: IPerson[];
}

interface IDispatchProps {
  showPersonModal: (
    name: string,
    role: string,
    description: TTranslatedString,
    image: string,
    socialChannels: IEtoSocialProfile[],
    website?: string,
  ) => void;
}

interface IState {
  slidesPerView: number;
  elementWidth: number;
  visibleWidth: number;
  gap: number;
  position: number;
  isVisible: boolean;
  touchX: number;
  touchStart: number | null;
  translation: number;
}

const clamp = (position: number, min: number, max: number) => {
  if (position > max) {
    return max;
  } else if (position < min) {
    return min;
  } else {
    return position;
  }
};

class PeopleSwiperWidgeLayout extends React.PureComponent<IOwnProps & IDispatchProps, IState> {
  swiperRef = React.createRef<HTMLDivElement>();
  columnGap = 16;

  state: IState = {
    slidesPerView: this.getSlidesPerView(),
    elementWidth: 0,
    visibleWidth: 0,
    gap: 0,
    position: 0,
    isVisible: false,
    touchX: 0,
    touchStart: null,
    translation: 0,
  };

  setSwiperState = () => {
    const [visibleWidth, elementWidth] = this.getVisibleWidth();

    const newState = {
      isVisible: Boolean(this.swiperRef.current),
      elementWidth: elementWidth,
      visibleWidth: visibleWidth,
    };

    if (!isEqual(newState, this.state)) {
      this.setState(newState);
    }
  };

  componentDidMount(): void {
    window.addEventListener("resize", this.onWindowResize);
    this.setSwiperState();
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.onWindowResize);
  }

  componentDidUpdate(): void {
    this.setSwiperState();
  }

  getSlidesPerView(): number {
    const maxSlidesPerView = this.getMaxSlidesPerView();
    return this.props.people.length < maxSlidesPerView
      ? this.props.people.length
      : maxSlidesPerView;
  }

  getMaxSlidesPerView(): number {
    const width = window.innerWidth;
    if (width <= 740) {
      return 1;
    } else if (width <= 768) {
      return 2;
    } else if (width <= 992) {
      return 3;
    } else {
      return 5;
    }
  }

  getVisibleWidth(): [number, number] {
    if (this.swiperRef.current) {
      const element = this.swiperRef.current.parentElement!.parentElement!;
      const style = window.getComputedStyle(element);
      const paddingLeft = parseFloat(style.paddingLeft || "0");
      const paddingRight = parseFloat(style.paddingRight || "0");
      const visibleWidth = element.getBoundingClientRect().width - paddingLeft - paddingRight;
      const elementWidth =
        (visibleWidth - this.columnGap * (this.state.slidesPerView - 1)) / this.state.slidesPerView;
      return [visibleWidth, elementWidth];
    } else {
      return [0, 0];
    }
  }

  canGoLeft = () => {
    //overall width of movingPart of slider
    const maxWidth =
      this.state.elementWidth * this.props.people.length +
      (this.props.people.length - 1) * this.columnGap;

    // how far left it can go regarding slidesPerView
    const maxTranslation = maxWidth - this.state.visibleWidth;

    //how far to the left is can go from the current position
    // (translation is always negative)
    const maxGoLeft = maxTranslation - Math.abs(this.state.translation);
    return maxGoLeft > 0;
  };

  canGoRight = () =>
    // (translation is always negative)
    this.state.translation < 0;

  onWindowResize = (): void => {
    const [refWidth, elementWidth] = this.getVisibleWidth();
    this.setState({
      slidesPerView: this.getSlidesPerView(),
      elementWidth: elementWidth,
      visibleWidth: refWidth,
      translation: 0,
    });
  };

  onTouchStart = (e: any) => {
    // cache the event prop because event will be immediately reused,
    // @see https://reactjs.org/docs/events.html#event-pooling
    const x = e.touches[0].pageX;

    this.setState({
      touchStart: x,
    });
  };

  onTouchMove = (e: any) => {
    const x = e.touches[0].pageX;
    const delta = e.touches[0].pageX - this.state.touchStart!;

    this.setState(s => ({
      touchStart: x,
      translation: s.translation + delta,
    }));
  };

  nextFullElementPosition = (elementWidth: number): number => {
    const fullElementWidth = elementWidth + this.columnGap;
    const position = Math.round(this.state.translation / fullElementWidth);

    return (
      clamp(position, this.state.slidesPerView - this.props.people.length, 0) * fullElementWidth
    );
  };

  onTouchCancel = () => {
    this.setState({
      translation: this.nextFullElementPosition(this.state.elementWidth),
    });
  };

  goLeft = () => {
    this.setState(s => ({
      translation: s.translation - (this.state.elementWidth + this.columnGap),
    }));
  };

  goRight = () => {
    this.setState(s => ({
      translation: s.translation + (this.state.elementWidth + this.columnGap),
    }));
  };

  render(): React.ReactNode {
    const isHorizontal = this.props.people.length < 3 || this.state.slidesPerView < 3;
    const showArrows = this.props.people.length > this.state.slidesPerView;

    return (
      <div className={styles.swiperMain} style={{ width: this.state.visibleWidth }}>
        {showArrows && (
          <ButtonIcon
            svgIcon={prevIcon}
            disabled={!this.canGoRight()}
            className={styles.prev}
            onClick={this.canGoRight() ? this.goRight : undefined}
          />
        )}
        <div className={styles.swiperBase} ref={this.swiperRef}>
          {this.state.isVisible ? (
            <div
              className={styles.swiperMovingPart}
              style={{
                transform: `translate(${this.state.translation}px)`,
              }}
              onTouchStart={this.onTouchStart}
              onTouchEnd={this.onTouchCancel}
              onTouchCancel={this.onTouchCancel}
              onTouchMove={this.onTouchMove}
            >
              {this.props.people.map(
                ({ image, name, description, role, socialChannels, website }, i) => (
                  <div
                    className={styles.swiperElement}
                    style={{ width: this.state.elementWidth }}
                    key={i}
                  >
                    <button
                      className={styles.clickable}
                      onClick={() =>
                        this.props.showPersonModal(
                          name,
                          role,
                          description,
                          image,
                          socialChannels,
                          website,
                        )
                      }
                    >
                      <SlidePerson
                        description={description}
                        socialChannels={socialChannels}
                        role={role}
                        name={name}
                        srcSet={{ "1x": image }}
                        layout={isHorizontal ? "horizontal" : "vertical"}
                      />
                    </button>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>
        {showArrows && (
          <ButtonIcon
            svgIcon={nextIcon}
            disabled={!this.canGoLeft()}
            className={styles.next}
            onClick={this.canGoLeft() ? this.goLeft : undefined}
          />
        )}
      </div>
    );
  }
}

const PeopleSwiperWidget = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      showPersonModal: (name, role, description, image, socialChannels, website) =>
        dispatch(
          actions.personProfileModal.showPersonProfileModal(
            name,
            role,
            description,
            image,
            socialChannels,
            website,
          ),
        ),
    }),
  }),
)(PeopleSwiperWidgeLayout);

export { PeopleSwiperWidget, PeopleSwiperWidgeLayout };
