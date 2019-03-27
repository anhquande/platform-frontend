import { IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { IAppState } from "../../store";

export const selectBookbuildingStats = (state: IAppState, etoId: string) =>
  state.bookBuildingFlow.bookbuildingStats[etoId];

export const selectMyPledge = (state: IAppState, etoId: string): IPledge | undefined =>
  state.bookBuildingFlow.pledges[etoId];
