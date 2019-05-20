export const appRoutes = {
  verify: "/email-verify",
  icbmMigration: "/migrate",
  walletUnlock: "/wallet-unlock-etherlock",

  root: "/",

  register: "/register",
  registerEto: "/eto/register",
  login: "/login",
  loginEto: "/eto/login",
  restore: "/restore",
  restoreEto: "/eto/restore",
  etoIssuerView: "/eto/view",

  etoPublicView: "/eto/view/:jurisdiction/:previewCode",
  etoPublicViewById: "/eto/by-id/:jurisdiction/:etoId",

  /*
   * @deprecated Route with eto jurisdiction should be used instead. This is only for backward compatibility.
   */
  etoPublicViewByIdLegacyRoute: "/eto/by-id/:etoId",
  /*
   * @deprecated Route with eto jurisdiction should be used instead. This is only for backward compatibility.
   */
  etoPublicViewLegacyRoute: "/eto/view/:previewCode",

  etoWidgetView: "/embed/eto/widget/:previewCode",

  kyc: "/kyc",
  wallet: "/wallet",
  dashboard: "/dashboard",
  documents: "/documents",
  profile: "/profile",
  demo: "/demo",
  eto: "/eto",
  etoLanding: "/eto-landing",

  etoRegister: "/eto/registration",

  portfolio: "/portfolio",
};
