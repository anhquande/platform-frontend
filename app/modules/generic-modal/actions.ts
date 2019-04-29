import * as React from "react";

import { TMessage } from "../../components/translatedMessages/utils";
import { OmitKeys } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";
import { TIconType } from "./reducer";

// TODO: Refactor actions to receive single object as a parameter
export const genericModalActions = {
  showModal: <T extends { closeModal?: () => void }, P = OmitKeys<T, "closeModal">>(
    component: React.ComponentType<T>,
    props?: P,
  ) => createAction("MODAL_SHOW", { component, props }),

  showGenericModal: (
    title: TMessage,
    description?: TMessage,
    icon?: TIconType,
    actionLinkText?: TMessage,
    // TODO: find circular dependency in AppActionTypes
    onClickAction?: any,
  ) =>
    createAction("GENERIC_MODAL_SHOW", { title, description, icon, actionLinkText, onClickAction }),

  showInfoModal: (
    title: TMessage,
    description?: TMessage,
    actionLinkText?: TMessage,
    onClickAction?: any,
  ) =>
    genericModalActions.showGenericModal(
      title,
      description,
      "check",
      actionLinkText,
      onClickAction,
    ),

  showErrorModal: (
    title: TMessage,
    description?: TMessage,
    actionLinkText?: TMessage,
    onClickAction?: any,
  ) =>
    genericModalActions.showGenericModal(
      title,
      description,
      "exclamation",
      actionLinkText,
      onClickAction,
    ),

  hideGenericModal: () => createSimpleAction("GENERIC_MODAL_HIDE"),
};
