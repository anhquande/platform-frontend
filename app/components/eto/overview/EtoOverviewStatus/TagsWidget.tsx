import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import {
  EJurisdiction,
  EOfferingDocumentType,
} from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { EtherscanAddressLink } from "../../../shared/links";
import { ETagSize, Tag } from "../../../shared/Tag.unsafe";
import { EtoWidgetContext } from "../../EtoWidgetView";

export interface ITagsWidget {
  termSheet: IEtoDocument;
  prospectusApproved: IEtoDocument;
  smartContractOnChain: boolean;
  etoId: string;
  offeringDocumentType: EOfferingDocumentType;
  innerClass?: string;
  jurisdiction: EJurisdiction;
}

type TDispatchProps = {
  downloadDocument: (document: IEtoDocument) => void;
};

type TLayoutProps = ITagsWidget & TDispatchProps;

const hasDocument = (document: IEtoDocument): boolean =>
  !!document && !!document.name && !!document.name.length;

const TagsWidgetLayout: React.FunctionComponent<TLayoutProps> = ({
  termSheet,
  prospectusApproved,
  smartContractOnChain,
  etoId,
  downloadDocument,
  jurisdiction,
  offeringDocumentType,
  innerClass,
}) => {
  const approvedDocumentTitle =
    offeringDocumentType === EOfferingDocumentType.PROSPECTUS ? (
      <FormattedMessage id="shared-component.eto-overview.prospectus-approved" />
    ) : (
      <FormattedMessage id="shared-component.eto-overview.investment-memorandum" />
    );

  return (
    <EtoWidgetContext.Consumer>
      {previewCode => (
        <>
          {hasDocument(termSheet) ? (
            <Tag
              onClick={e => {
                downloadDocument(termSheet);
                e.stopPropagation();
              }}
              to={previewCode ? etoPublicViewLink(previewCode, jurisdiction) : undefined}
              target={previewCode ? "_blank" : undefined}
              size={ETagSize.TINY}
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
              dataTestId="eto-overview-term-sheet-button"
              className={innerClass}
            />
          ) : (
            <Tag
              size={ETagSize.TINY}
              theme="silver"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.term-sheet" />}
              className={innerClass}
            />
          )}
          {hasDocument(prospectusApproved) ? (
            <Tag
              onClick={e => {
                downloadDocument(prospectusApproved);
                e.stopPropagation();
              }}
              to={previewCode ? etoPublicViewLink(previewCode, jurisdiction) : undefined}
              target={previewCode ? "_blank" : undefined}
              size={ETagSize.TINY}
              theme="green"
              layout="ghost"
              text={approvedDocumentTitle}
              dataTestId="eto-overview-prospectus-approved-button"
              className={innerClass}
            />
          ) : (
            <Tag
              size={ETagSize.TINY}
              theme="silver"
              layout="ghost"
              text={approvedDocumentTitle}
              className={innerClass}
            />
          )}
          {smartContractOnChain ? (
            <Tag
              onClick={e => e.stopPropagation()}
              component={EtherscanAddressLink}
              componentProps={{ address: etoId }}
              to={previewCode ? etoPublicViewLink(previewCode, jurisdiction) : undefined}
              target={previewCode ? "_blank" : undefined}
              size={ETagSize.TINY}
              theme="green"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
              dataTestId="eto-overview-smart-contract-on-chain-button"
              className={innerClass}
            />
          ) : (
            <Tag
              size={ETagSize.TINY}
              theme="silver"
              layout="ghost"
              text={<FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />}
              className={innerClass}
            />
          )}
        </>
      )}
    </EtoWidgetContext.Consumer>
  );
};

const TagsWidget = compose<TLayoutProps, ITagsWidget>(
  appConnect<{}, TDispatchProps>({
    dispatchToProps: dispatch => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.eto.downloadEtoDocument(document)),
    }),
  }),
)(TagsWidgetLayout);

export { TagsWidget, TagsWidgetLayout };
