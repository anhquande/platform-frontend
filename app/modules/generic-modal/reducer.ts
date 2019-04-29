import { genericModalIcons } from "../../components/modals/GenericModal";
import { TMessage } from "../../components/translatedMessages/utils";
import { AppActionTypes, AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IGenericModalState {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
  component?: React.ComponentType<{ closeModal?: () => void }>;
  componentProps?: object;
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
  component: undefined,
  componentProps: undefined,
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
        componentProps: action.payload.props,
      };
    case "GENERIC_MODAL_HIDE":
      return initialState;
  }

  return state;
};
