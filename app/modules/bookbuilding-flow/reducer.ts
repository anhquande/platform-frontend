import { IBookBuildingStats, IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { AppReducer } from "../../store";
import { DeepReadonly, Dictionary } from "../../types";
import { SET_BOOKBUILDING_FLOW_STATS, SET_PLEDGE } from "./actions";

export interface IBookbuildingFLow {
  bookbuildingStats: Dictionary<IBookBuildingStats>;
  pledges: Dictionary<IPledge | undefined>;
}

export const bookBuildingFlow: IBookbuildingFLow = {
  bookbuildingStats: {},
  pledges: {},
};

export const bookBuildingFlowReducer: AppReducer<IBookbuildingFLow> = (
  state = bookBuildingFlow,
  action,
): DeepReadonly<IBookbuildingFLow> => {
  switch (action.type) {
    case SET_BOOKBUILDING_FLOW_STATS:
      return {
        ...state,
        bookbuildingStats: {
          ...state.bookbuildingStats,
          [action.payload.etoId]: action.payload.stats,
        },
      };
    case SET_PLEDGE:
      return {
        ...state,
        pledges: {
          ...state.pledges,
          [action.payload.etoId]: action.payload.pledge,
        },
      };
  }
  return state;
};
