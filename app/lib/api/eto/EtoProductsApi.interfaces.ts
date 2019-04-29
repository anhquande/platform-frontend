import * as YupTS from "../../yup-ts";

export enum EAssetType {
  SECURITY = "security",
  VMA = "vma",
}

export enum EOfferingDocumentSubtype {
  REGULAR = "regular",
  LEAN = "lean",
}

export enum EOfferingDocumentType {
  PROSPECTUS = "prospectus",
  MEMORANDUM = "memorandum",
}

export enum EJurisdiction {
  GERMANY = "de",
  LIECHTENSTEIN = "li",
}

export enum EProductName {
  HNWI_ETO_DE = "hnwi eto de",
  HNWI_ETO_LI = "hnwi eto li",
  PRIVATE_ETO_LI = "private eto li",
  MINI_ETO_LI = "mini eto li",
  EU_SME_ETO_LI = "eu-sme eto li",
  RETAIL_ETO_DE = "retail eto de",
  RETAIL_ETO_LI_SECURITY = "retail eto li security",
  RETAIL_ETO_LI_VMA = "retail eto li vma",
  FIFTH_FORCE_ETO = "ff eto",
}

export const EtoProductSchema = YupTS.object({
  assetType: YupTS.string<EAssetType>(),
  available: YupTS.boolean(),
  canSetTransferability: YupTS.boolean(),
  hasNominee: YupTS.boolean(),
  id: YupTS.string(),
  jurisdiction: YupTS.string<EJurisdiction>(),
  maxClaimDurationDays: YupTS.number(),
  maxInvestmentAmount: YupTS.number(),
  maxOfferDurationDays: YupTS.number(),
  maxPublicDurationDays: YupTS.number(),
  maxSigningDurationDays: YupTS.number(),
  maxTicketSize: YupTS.number(),
  maxWhitelistDurationDays: YupTS.number(),
  minClaimDurationDays: YupTS.number(),
  minInvestmentAmount: YupTS.number(),
  minOfferDurationDays: YupTS.number(),
  minPublicDurationDays: YupTS.number(),
  minSigningDurationDays: YupTS.number(),
  minTicketSize: YupTS.number(),
  minWhitelistDurationDays: YupTS.number(),
  name: YupTS.string<EProductName>(),
  offeringDocumentSubtype: YupTS.string<EOfferingDocumentSubtype>().optional(),
  offeringDocumentType: YupTS.string<EOfferingDocumentType>(),
});

export const EtoProductsSchema = YupTS.array(EtoProductSchema);

export type TEtoProducts = YupTS.TypeOf<typeof EtoProductsSchema>;
export type TEtoProduct = YupTS.TypeOf<typeof EtoProductSchema>;
