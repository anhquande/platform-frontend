import { fork } from "redux-saga/effects";

import { FileUploadMessage } from "../../../components/translatedMessages/messages.unsafe";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IHttpResponse } from "../../../lib/api/client/IHttpClient";
import { TFileDescription } from "../../../lib/api/FileStorage.interfaces";
import { TAction } from "../../actions";
import { neuTakeEvery } from "../../sagasUtils";

function* singleFileUpload(
  { fileStorageApi, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "FORM_SINGLE_FILE_UPLOAD_START") return;
  const { file, onDone } = action.payload;

  try {
    const fileData: IHttpResponse<TFileDescription> = yield fileStorageApi.uploadFile(
      "image",
      file,
    );

    onDone(undefined, fileData.body.url);
  } catch (e) {
    logger.error("Error while uploading single file", e);
    notificationCenter.error(createMessage(FileUploadMessage.FILE_UPLOAD_ERROR));
    onDone(e, undefined);
  }
}

export function* formSingleFileUploadSagas(): any {
  yield fork(neuTakeEvery, "FORM_SINGLE_FILE_UPLOAD_START", singleFileUpload);
}
