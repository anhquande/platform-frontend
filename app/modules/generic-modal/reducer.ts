import { genericModalIcons } from "../../components/modals/generic-modal/GenericModal.unsafe";
import { TMessage } from "../../components/translatedMessages/utils";
import { AppActionTypes, AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IGenericModalState {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
  component?: React.ComponentType<any>;
}

//Add more custom icons here
export type TIconType = keyof typeof genericModalIcons;

export interface IGenericModal {
  title: TMessage;
  description?: TMessage;
  icon?: TIconType;
  actionLinkText?: TMessage;
  onClickAction?: AppActionTypes;
}

const initialState: IGenericModalState = {
  isOpen: false,
};

export const genericModalReducer: AppReducer<IGenericModalState> = (
  state = initialState,
  action,
): DeepReadonly<IGenericModalState> => {
  switch (action.type) {
    case "GENERIC_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        genericModalObj: action.payload,
      };
    case "MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        component: action.payload.component,
      };
    case "GENERIC_MODAL_HIDE":
      return initialState;
  }

  return state;
};

export const selectGenericModalIsOpen = (state: DeepReadonly<IGenericModalState>): boolean =>
  state.isOpen;
export const selectGenericModalObj = (
  state: DeepReadonly<IGenericModalState>,
): DeepReadonly<IGenericModal> | undefined => state.genericModalObj;
export const selectGenericModalComponent = (
  state: DeepReadonly<IGenericModalState>,
): React.ComponentType<any> | undefined => state.component;
