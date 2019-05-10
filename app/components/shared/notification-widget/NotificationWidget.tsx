import { compact, isEmpty } from "lodash";
import * as React from "react";
import { branch, compose, renderNothing } from "recompose";

import { INotification } from "../../../modules/notifications/reducer";
import {
  selectNotifications,
  selectSettingsNotification,
} from "../../../modules/notifications/selectors";
import { appConnect, AppDispatch } from "../../../store";
import { Notification } from "./Notification";

import * as styles from "./NotificationWidget.module.scss";

interface IStateProps {
  notifications: INotification[];
}

interface IDispatchProps {
  dispatch: AppDispatch;
}

type IProps = IStateProps & IDispatchProps;

const NotificationWidgetComponent: React.FunctionComponent<IProps> = ({
  notifications,
  dispatch,
}) => (
  <div className={styles.widget}>
    {notifications.map((notification, index) => (
      <Notification
        key={notification.text + index.toString(10)}
        type={notification.type}
        text={notification.text}
        onClick={() => dispatch(notification.onClickAction)}
      />
    ))}
  </div>
);

export const NotificationWidget = compose<IProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const notifications = selectNotifications(state);
      const appStateDerivedNotifications = compact([selectSettingsNotification(state)]);
      return {
        notifications: [...notifications, ...appStateDerivedNotifications],
      };
    },
  }),
  branch<IStateProps>(state => isEmpty(state.notifications), renderNothing),
)(NotificationWidgetComponent);
