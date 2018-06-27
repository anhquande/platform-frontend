import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NavLink, NavLinkProps } from "react-router-dom";

import { TUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { selectIsActionRequiredSettings } from "../../modules/notifications/selectors";
import { appConnect } from "../../store";
import { invariant } from "../../utils/invariant";
import { appRoutes } from "../appRoutes";
import { InlineIcon } from "../shared/InlineIcon";

import * as iconDashboard from "../../assets/img/inline_icons/icon-menu-dashboard.svg";
import * as iconDocuments from "../../assets/img/inline_icons/icon-menu-documents.svg";
import * as iconEto from "../../assets/img/inline_icons/icon-menu-eto.svg";
import * as iconHelp from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as iconSettings from "../../assets/img/inline_icons/icon-menu-settings.svg";
import * as iconEdit from "../../assets/img/inline_icons/icon_edit.svg";
import * as iconWallet from "../../assets/img/inline_icons/icon_wallet_inactive.svg";
import { externalRoutes } from "../externalRoutes";
import * as styles from "./LayoutAuthorizedMenu.module.scss";

interface IMenuEntry {
  svgString: string;
  menuName: string | React.ReactNode;
  actionRequired?: boolean;
  to: string;
}

interface IStateProps {
  userType?: TUserType;
  actionRequiredSettings: boolean;
}

const MenuEntryContent: React.SFC<IMenuEntry & NavLinkProps> = ({
  actionRequired,
  menuName,
  svgString,
  ...props
}) => {
  return (
    <>
      <span className={styles.icon} {...props}>
        <InlineIcon svgIcon={svgString} />
        {actionRequired && <div className={styles.actionIndicator} />}
      </span>
      <span className={styles.name}>{menuName}</span>
    </>
  );
};

const MenuEntry: React.SFC<IMenuEntry & NavLinkProps> = ({ to, svgString, ...props }) => {
  const isAbsoluteLink = /^https?:\/\//.test(to);

  return isAbsoluteLink ? (
    <a href={to} target="_blank" className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} />
    </a>
  ) : (
    <NavLink to={to} className={styles.menuItem}>
      <MenuEntryContent {...props} to={to} svgString={svgString} />
    </NavLink>
  );
};

const InvestorMenu: React.SFC<{ actionRequiredSettings: boolean }> = ({
  actionRequiredSettings,
}) => (
  <div className={styles.menu}>
    <MenuEntry
      svgString={iconDashboard}
      to={appRoutes.dashboard}
      menuName={<FormattedMessage id="menu.start" />}
    />
    <MenuEntry
      svgString={iconWallet}
      to={appRoutes.wallet}
      menuName={<FormattedMessage id="menu.wallet" />}
    />
    <MenuEntry
      svgString={iconHelp}
      to={externalRoutes.freshdesk}
      menuName={<FormattedMessage id="menu.help" />}
      target="_blank"
    />
    <MenuEntry
      svgString={iconSettings}
      to={appRoutes.settings}
      menuName={<FormattedMessage id="menu.settings" />}
      actionRequired={actionRequiredSettings}
      data-test-id="authorized-layout-settings-button"
    />
  </div>
);

const IssuerMenu: React.SFC<{ actionRequiredSettings: boolean }> = ({ actionRequiredSettings }) => (
  <div className={styles.menu}>
    <MenuEntry
      svgString={iconDashboard}
      to={appRoutes.etoOverview}
      menuName={<FormattedMessage id="menu.overview" />}
    />
    <MenuEntry
      svgString={iconEto}
      to={appRoutes.dashboard}
      menuName={<FormattedMessage id="menu.eto-page" />}
    />
    <MenuEntry
      svgString={iconEdit}
      to={appRoutes.etoRegister}
      menuName={<FormattedMessage id="menu.edit-page" />}
    />
    <MenuEntry
      svgString={iconDocuments}
      to="#0"
      menuName={<FormattedMessage id="menu.documents-page" />}
    />
    <MenuEntry
      svgString={iconHelp}
      to="https://neufund.freshdesk.com/support/home"
      menuName={<FormattedMessage id="menu.help" />}
      target="_blank"
    />
    <MenuEntry
      svgString={iconSettings}
      to={appRoutes.settings}
      menuName={<FormattedMessage id="menu.settings" />}
      actionRequired={actionRequiredSettings}
    />
  </div>
);

export const LayoutAuthorizedMenuComponent: React.SFC<IStateProps> = ({ userType, ...props }) => {
  switch (userType) {
    case "investor":
      return <InvestorMenu data-test-id="investor-menu" {...props} />;
    case "issuer":
      return <IssuerMenu data-test-id="issuer-menu" {...props} />;
    default:
      return invariant(false, "Unknown user type");
  }
};

export const LayoutAuthorizedMenu = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    userType: selectUserType(s.auth),
    actionRequiredSettings: selectIsActionRequiredSettings(s),
  }),
})(LayoutAuthorizedMenuComponent);
