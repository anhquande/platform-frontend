import { DeepReadonly } from "../../types";
import { TranslatedMessageType } from "./messages.unsafe";

export type TMessage = DeepReadonly<{
  messageType: TranslatedMessageType;
  messageData?: Object;
}>;

export const createMessage = (messageType: TranslatedMessageType, messageData?: any): TMessage => ({
  messageType,
  messageData,
});
