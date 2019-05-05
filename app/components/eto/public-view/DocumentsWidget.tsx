import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "recompose";

import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IEtoDocument, TEtoDocumentTemplates } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { ignoredDocuments, ignoredTemplates } from "../../../lib/api/eto/EtoFileUtils";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { getDocumentTitles } from "../../documents/utils";
import { EColumnSpan } from "../../layouts/Container";
import { DocumentLink, DocumentTemplateButton } from "../../shared/DocumentLink";
import { InlineIcon } from "../../shared/icons";
import { Panel } from "../../shared/Panel";

import * as icon_link from "../../../assets/img/inline_icons/social_link.svg";
import * as styles from "./DocumentsWidget.module.scss";

type TExternalProps = {
  companyMarketingLinks: TCompanyEtoData["marketingLinks"];
  etoTemplates: TEtoDocumentTemplates;
  etoDocuments: TEtoDocumentTemplates;
  isRetailEto: boolean;
  columnSpan?: EColumnSpan;
};

type TDispatchProps = {
  downloadDocument: (document: IEtoDocument) => void;
};

const DocumentsWidgetLayout: React.FunctionComponent<
  TDispatchProps & TExternalProps & CommonHtmlProps
> = ({
  downloadDocument,
  companyMarketingLinks,
  etoDocuments,
  etoTemplates,
  className,
  isRetailEto,
  columnSpan,
}) => {
  const documentTitles = getDocumentTitles(isRetailEto);
  return (
    <Panel className={className} columnSpan={columnSpan}>
      <section className={styles.group}>
        <div className={styles.groupName}>
          <FormattedMessage id="eto.public-view.documents.marketing-links" />
        </div>
        <Row>
          {companyMarketingLinks &&
            companyMarketingLinks.map((link, i) =>
              link.url && link.url !== "" ? (
                <Col sm="6" md="12" lg="6" key={i} className={styles.document}>
                  <DocumentLink
                    url={link.url || ""}
                    name={link.title || ""}
                    altIcon={<InlineIcon svgIcon={icon_link} />}
                  />
                </Col>
              ) : null,
            )}
        </Row>
      </section>
      <section className={styles.group}>
        <div className={styles.groupName}>
          <FormattedMessage id="eto.public-view.documents.legal-documents" />
        </div>
        <Row>
          {Object.keys(etoTemplates)
            .filter(key => !ignoredTemplates.some(template => template === key))
            .map((key, i) => (
              <Col sm="6" md="12" lg="6" key={i} className={styles.document}>
                <DocumentTemplateButton
                  onClick={() => downloadDocument(etoTemplates[key])}
                  title={documentTitles[etoTemplates[key].documentType]}
                />
              </Col>
            ))}
          {Object.keys(etoDocuments)
            .filter(
              key =>
                !ignoredDocuments.some(document => document === etoDocuments[key].documentType),
            )
            .map((key, i) => (
              <Col sm="6" md="12" lg="6" key={i} className={styles.document}>
                <DocumentTemplateButton
                  onClick={() => downloadDocument(etoDocuments[key])}
                  title={documentTitles[etoDocuments[key].documentType]}
                />
              </Col>
            ))}
        </Row>
      </section>
    </Panel>
  );
};

const DocumentsWidget = compose<
  TExternalProps & TDispatchProps & CommonHtmlProps,
  TExternalProps & CommonHtmlProps
>(
  appConnect<{}, TDispatchProps, TExternalProps>({
    dispatchToProps: dispatch => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.eto.downloadEtoDocument(document)),
    }),
  }),
)(DocumentsWidgetLayout);

export { DocumentsWidget, DocumentsWidgetLayout };
