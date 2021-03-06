import { externalRoutes } from "../config/externalRoutes";
import { withParams } from "../utils/withParams";
import { appRoutes } from "./appRoutes";

export const etoPublicViewLink = (previewCode: string, jurisdiction: string) =>
  withParams(appRoutes.etoPublicView, {
    previewCode,
    jurisdiction,
  });

export const icoMonitorEtoLink = (etoId: string) =>
  withParams(externalRoutes.icoMonitorEto, { etoId });

export const commitmentStatusLink = (walletAddress: string) =>
  withParams(externalRoutes.commitmentStatus, { walletAddress });

export const etoPublicViewByIdLink = (etoId: string, jurisdiction: string) =>
  withParams(appRoutes.etoPublicViewById, { etoId, jurisdiction });

export const etoWidgetViewLink = (previewCode: string) =>
  withParams(appRoutes.etoWidgetView, { previewCode });

// Use only in tests
export const etoPublicViewByIdLinkLegacy = (etoId: string) =>
  withParams(appRoutes.etoPublicViewByIdLegacyRoute, { etoId });
