import { DeepPartial } from "../../types";
import * as YupTS from "../yup-ts";

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string();

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  website: YupTS.string(),
  companyTagline: YupTS.string(),
  companyDescription: YupTS.string(),
  foundersQuote: YupTS.string(),
  keyQuoteFromInvestor: YupTS.string(),
  tags: YupTS.array(tagsType),
  // here we are missing image uploading data
});
type TEtoTeamData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export type TEtoData = TEtoTeamData; // | other partial schemas;
export type TPartialEtoData = DeepPartial<TEtoData>;
