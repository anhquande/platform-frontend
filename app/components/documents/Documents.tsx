import * as cn from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Redirect } from "react-router";
import { branch, renderComponent, setDisplayName } from "recompose";
import { compose } from "redux";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { ignoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentsDownloading,
  selectEtoDocumentsUploading,
} from "../../modules/eto-documents/selectors";
import {
  selectIssuerEtoDocuments,
  selectIssuerEtoId,
  selectIssuerEtoOfferingDocumentType,
  selectIssuerEtoState,
  selectIssuerEtoTemplates,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import { selectEtoOnChainStateById } from "../../modules/eto/selectors";
import { EETOStateOnChain } from "../../modules/eto/types";
import { selectPendingDownloads } from "../../modules/immutable-file/selectors";
import { selectAreTherePendingTxs } from "../../modules/tx/monitor/selectors";
import { appConnect } from "../../store";
import { DeepReadonly } from "../../types";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { appRoutes } from "../appRoutes";
import { EtoFileIpfsModal } from "../eto/shared/EtoFileIpfsModal";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { ClickableDocumentTile, UploadableDocumentTile } from "../shared/Document";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { Heading } from "../shared/Heading";
import { LoadingIndicator } from "../shared/loading-indicator";
import { SingleColDocuments } from "../shared/SingleColDocumentWidget";
import { getDocumentTitles, isBusy, isFileUploaded, renameDocuments, uploadAllowed } from "./utils";

import * as styles from "./Documents.module.scss";

type TStateLoadedProps = {
  etoFilesData: DeepReadonly<IEtoFiles>;
  etoState: EEtoState;
  etoTemplates: TEtoDocumentTemplates;
  etoDocuments: TEtoDocumentTemplates;
  offeringDocumentType: EOfferingDocumentType;
  onChainState: EETOStateOnChain;
  documentsDownloading: { [key in EEtoDocumentType]?: boolean };
  documentsUploading: { [key in EEtoDocumentType]?: boolean };
  transactionPending: boolean;
  documentsGenerated: { [ipfsHash: string]: boolean };
  shouldEtoDataLoad: boolean;
  isLoading: false;
};

type TStateProps = { isLoading: true } | TStateLoadedProps;

interface IDispatchProps {
  generateTemplate: (document: IEtoDocument) => void;
  startDocumentDownload: (documentType: EEtoDocumentType) => void;
}

const DocumentsLayout: React.FunctionComponent<TStateLoadedProps & IDispatchProps> = ({
  etoFilesData,
  generateTemplate,
  etoState,
  etoTemplates,
  etoDocuments,
  startDocumentDownload,
  offeringDocumentType,
  onChainState,
  documentsUploading,
  documentsDownloading,
  transactionPending,
  documentsGenerated,
}) => {
  const { allTemplates, stateInfo } = etoFilesData;
  const documents = renameDocuments(stateInfo, onChainState);
  const etoTemplateKeys = Object.keys(etoTemplates);

  return (
    <>
      <div data-test-id="eto-documents" className={styles.layout}>
        <Heading level={3} className={cn(styles.header)}>
          <FormattedMessage id="documents.legal-documents" />
        </Heading>

        <section className={styles.documentSection}>
          <h4 className={cn(styles.groupName)}>
            <FormattedMessage id="documents.generated-documents" />
          </h4>
          {etoTemplateKeys.length !== 0 ? (
            etoTemplateKeys
              .filter(key => !ignoredTemplates.some(template => template === key))
              .map(key => (
                <ClickableDocumentTile
                  key={key}
                  document={allTemplates[key]}
                  generateTemplate={generateTemplate}
                  title={getDocumentTitles(offeringDocumentType)[allTemplates[key].documentType]}
                  extension={".doc"}
                  busy={documentsGenerated[allTemplates[key].ipfsHash]}
                />
              ))
          ) : (
            <div className={styles.note}>
              <FormattedMessage id="documents.please-fill-the-eto-forms-in-order-to-generate-templates" />
            </div>
          )}
        </section>

        <section className={styles.documentSection}>
          <h4 className={styles.groupName}>
            <FormattedMessage id="documents.approved-prospectus-and-agreements-to-upload" />
          </h4>
          {stateInfo &&
            documents.map((key: EEtoDocumentType) => (
              <UploadableDocumentTile
                key={key}
                documentKey={key}
                active={uploadAllowed(stateInfo, etoState, key, onChainState)}
                busy={isBusy(key, transactionPending, Boolean(documentsUploading[key]))}
                typedFileName={getDocumentTitles(offeringDocumentType)[key]}
                isFileUploaded={isFileUploaded(etoDocuments, key)}
                downloadDocumentStart={startDocumentDownload}
                documentDownloadLinkInactive={
                  Boolean(documentsUploading[key]) || Boolean(documentsDownloading[key])
                }
              />
            ))}
        </section>
        {allTemplates && (
          <SingleColDocuments
            documents={etoTemplateKeys.map(key => allTemplates[key])}
            title={<FormattedMessage id="documents.agreement-and-prospectus-templates" />}
            className={styles.documents}
            offeringDocumentType={offeringDocumentType}
          />
        )}
      </div>
      <EtoFileIpfsModal />
    </>
  );
};

const Documents = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  setDisplayName("Documents"),
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  appConnect<TStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectIssuerEtoId(state);
      const etoFilesData = selectEtoDocumentData(state.etoDocuments);

      if (!etoId || isEmpty(etoFilesData.allTemplates)) {
        return {
          isLoading: true,
        };
      }

      return {
        etoFilesData,
        isLoading: false,
        shouldEtoDataLoad: selectShouldEtoDataLoad(state),
        etoState: selectIssuerEtoState(state)!,
        onChainState: selectEtoOnChainStateById(state, etoId)!,
        etoTemplates: selectIssuerEtoTemplates(state)!,
        etoDocuments: selectIssuerEtoDocuments(state)!,
        documentsDownloading: selectEtoDocumentsDownloading(state.etoDocuments),
        documentsUploading: selectEtoDocumentsUploading(state.etoDocuments),
        transactionPending: selectAreTherePendingTxs(state),
        documentsGenerated: selectPendingDownloads(state),
        offeringDocumentType: selectIssuerEtoOfferingDocumentType(state)!,
      };
    },
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      startDocumentDownload: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentStart(documentType)),
    }),
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.documents-page") })),
  withContainer(LayoutAuthorized),
  branch<TStateProps>(props => props.isLoading, renderComponent(LoadingIndicator)),
  branch<TStateLoadedProps>(
    props => !props.shouldEtoDataLoad,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
)(DocumentsLayout);

export { Documents, DocumentsLayout };
