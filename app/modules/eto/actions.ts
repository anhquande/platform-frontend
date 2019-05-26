import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EEtoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { Dictionary } from "../../types";
import { createActionFactory } from "../actionsUtils";
import { IEtoContractData, IEtoTokenData } from "./types";

export const etoActions = {
  // public actions
  loadEtoPreview: createActionFactory(
    "ETO_LOAD_ETO_PREVIEW",
    (previewCode: string, widgetView?: boolean) => ({
      previewCode,
      widgetView,
    }),
  ),
  loadEto: createActionFactory("ETO_LOAD_ETO", (etoId: string, widgetView?: boolean) => ({
    etoId,
    widgetView,
  })),
  loadEtos: createActionFactory("ETO_LOAD_ETOS"),
  downloadEtoDocument: createActionFactory("ETO_DOWNLOAD_DOCUMENT", (document: IEtoDocument) => ({
    document,
  })),
  downloadEtoTemplateByType: createActionFactory(
    "ETO_DOWNLOAD_TEMPLATE_BY_TYPE",
    (etoId: string, documentType: EEtoDocumentType) => ({ etoId, documentType }),
  ),
  loadTokensData: createActionFactory("PORTFOLIO_LOAD_TOKENS_DATA"),
  setTokenData: createActionFactory(
    "PORTFOLIO_SET_TOKEN_DATA",
    (previewCode: string, tokenData: IEtoTokenData) => ({
      previewCode,
      tokenData,
    }),
  ),
  // state mutations
  setEtos: createActionFactory(
    "ETO_SET_ETOS",
    ({
      etos,
      companies,
    }: {
      etos: Dictionary<TEtoSpecsData>;
      companies: Dictionary<TCompanyEtoData>;
    }) => ({ etos, companies }),
  ),
  setEto: createActionFactory(
    "ETO_SET_ETO",
    ({ eto, company }: { eto: TEtoSpecsData; company?: TCompanyEtoData }) => ({ eto, company }),
  ),
  setEtosDisplayOrder: createActionFactory("ETO_SET_DISPLAY_ORDER", (order: string[]) => ({
    order,
  })),
  setEtoDataFromContract: createActionFactory(
    "ETO_SET_ETO_DATA_FROM_CONTRACT",
    (previewCode: string, data: IEtoContractData) => ({ previewCode, data }),
  ),
  setEtoWidgetError: createActionFactory("ETO_SET_ETO_WIDGET_ERROR"),

  verifyEtoAccess: createActionFactory("ETO_VERIFY_ETO_ACCESS", (previewCode: string) => ({
    previewCode,
  })),

  ensureEtoJurisdiction: createActionFactory(
    "ETO_VERIFY_ETO_JURISDICTION",
    (previewCode: string, jurisdiction: string) => ({
      previewCode,
      jurisdiction,
    }),
  ),
  confirmJurisdictionDisclaimer: createActionFactory("ETO_CONFIRM_JURISDICTION_DISCLAIMER"),
};
