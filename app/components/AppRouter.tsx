export const appRoutes = {
  verify: "/email-verify",

  root: "/",

  register: "/register",
  etoRegister: "/register-eto",
  login: "/login",
  etoLogin: "/login-eto",
  etoDashboard: "/eto-dashboard",
  recover: "/recover",
  etoRecover: "/recover-eto",

  kyc: "/kyc",
  wallet: "/wallet",
  dashboard: "/dashboard",
  settings: "/settings",
  demo: "/demo",
  eto: "/eto",
};

import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";

import { Dashboard } from "./dashboard/Dashboard";
import { Demo } from "./Demo";
import { Eto } from "./eto/Eto";
import { EtoDashboard } from "./eto/EtoDashboard"
import { Home } from "./Home";
import { Kyc } from "./kyc/Kyc";


import { emailVerify } from "./emailVerify";
import { BackupSeed } from "./settings/backupSeed/BackupSeed";
import { settingsRoutes } from "./settings/routes";
import { Settings } from "./settings/Settings";
import { Wallet } from "./wallet/Wallet";
import { WalletRecoverMain } from "./walletSelector/walletRecover/WalletRecoverMain";
import { WalletSelector } from "./walletSelector/WalletSelector";

export const AppRouter: React.SFC = () => (
  <Switch>
    <OnlyPublicRoute path={appRoutes.root} component={Home} exact />
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.recover} component={WalletRecoverMain} />

    {/* only investors routes */}
    <OnlyAuthorizedRoute path={appRoutes.wallet} investorComponent={Wallet} />
    <OnlyAuthorizedRoute path={appRoutes.kyc} investorComponent={Kyc} />

    {/* only issuers routes */}
    <OnlyAuthorizedRoute path={appRoutes.eto} issuerComponent={Eto} />
    <OnlyAuthorizedRoute path={appRoutes.etoDashboard} issuerComponent={EtoDashboard} />

    {/* common routes for both investors and issuers */}
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={emailVerify}
      issuerComponent={emailVerify}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={Dashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.settings}
      investorComponent={Settings}
      issuerComponent={Settings}
      exact
    />
    <OnlyAuthorizedRoute
      path={settingsRoutes.seedBackup}
      investorComponent={BackupSeed}
      issuerComponent={BackupSeed}
      exact
    />

    <Route path={appRoutes.demo} component={Demo} />

    <Redirect to={appRoutes.root} />
  </Switch>
);
