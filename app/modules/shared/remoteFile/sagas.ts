import {fork} from "redux-saga/effects";

import {TGlobalDependencies} from "../../../di/setupBindings";
import {IHttpResponse} from "../../../lib/api/client/IHttpClient";
import {TFileDescription} from "../../../lib/api/FileStorage.interfaces";
import {TAction} from "../../actions";
import {neuTakeEvery} from "../../sagasUtils";
import {createMessage} from "../../../components/translatedMessages/utils";
import {RemoteFileMessage} from "../../../components/translatedMessages/messages";

function* getRemoteFile(
  { fileStorageApi, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "REMOTE_FILE_GET") return;
  const { fileUrl, onDone } = action.payload;

  try {
    const fileData: IHttpResponse<TFileDescription> = yield fileStorageApi.getFile(fileUrl);

    onDone(undefined, fileData.body);
  } catch (e) {
    logger.error("get remote file error", e);
    notificationCenter.error(createMessage(RemoteFileMessage.GET_FILES_DETAILS_ERROR));
    onDone(e, undefined);
  }
}

export function* remoteFileSagas(): any {
  yield fork(neuTakeEvery, "REMOTE_FILE_GET", getRemoteFile);
}
