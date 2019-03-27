import { delay } from "redux-saga";
import { put } from "redux-saga-test-plan/matchers";
import { call, fork } from "redux-saga/effects";

import { IpfsMessage } from "../../components/translatedMessages/messages.unsafe";
import { createMessage } from "../../components/translatedMessages/utils";
import { IS_CYPRESS } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagasUtils";
import { downloadLink } from "./utils";

export function* downloadFile(
  { apiImmutableStorage, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "IMMUTABLE_STORAGE_DOWNLOAD_FILE") return;
  try {
    const immutableFileId = action.payload.immutableFileId;
    const downloadedFile = yield apiImmutableStorage.getFile(immutableFileId);
    const extension = immutableFileId.asPdf ? ".pdf" : ".doc";

    if (IS_CYPRESS) {
      // required for cypress to be able to simulate generating time
      yield delay(0);
    }

    yield call(downloadLink, downloadedFile, action.payload.fileName, extension);
  } catch (e) {
    logger.error("Failed to download file from IPFS", e);
    notificationCenter.error(createMessage(IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE)); //Failed to download file from IPFS
  } finally {
    yield put(
      actions.immutableStorage.downloadImmutableFileDone(action.payload.immutableFileId.ipfsHash),
    );
  }
}

export const immutableFileSagas = function*(): any {
  yield fork(neuTakeEvery, "IMMUTABLE_STORAGE_DOWNLOAD_FILE", downloadFile);
};
