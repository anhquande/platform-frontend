import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent, renderNothing } from "recompose";
import { compose } from "redux";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectEtoDocumentData } from "../../../../modules/eto-documents/selectors";
import {
  selectIssuerEtoId,
  selectUploadedInvestmentAgreement,
} from "../../../../modules/eto-flow/selectors";
import { selectEtoOnChainStateById } from "../../../../modules/eto/selectors";
import { EETOStateOnChain } from "../../../../modules/eto/types";
import { appConnect } from "../../../../store";
import { EColumnSpan } from "../../../layouts/Container";
import { ButtonArrowRight } from "../../../shared/buttons/Button";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { Panel } from "../../../shared/Panel";
import { SignInvestmentAgreement } from "./SignInvestmentAgreement";

import * as styles from "../../EtoContentWidget.module.scss";

interface IDispatchProps {
  downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => void;
}

interface IStateProps {
  stateOnChain: EETOStateOnChain;
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | null;
}

interface IUploadComponentStateProps {
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | null;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

interface IEtoCompletedWidgetProps {
  goToWallet: () => void;
}

export const UploadInvestmentAgreementLayout: React.FunctionComponent<
  IUploadComponentStateProps & IDispatchProps & IExternalProps
> = ({ downloadAgreementTemplate, agreementTemplate, columnSpan }) => (
  <Panel columnSpan={columnSpan}>
    <Heading size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="download-agreement-widget.signing-title" />
    </Heading>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>
        <FormattedMessage id="download-agreement-widget.signing-text" />
      </p>
      <ButtonArrowRight
        data-test-id="eto-dashboard-submit-proposal"
        onClick={() => downloadAgreementTemplate(agreementTemplate)}
      >
        <FormattedMessage id="download-agreement-widget.download-and-sign" />
      </ButtonArrowRight>
    </div>
  </Panel>
);

export const EtoCompletedWidgetLayout: React.ComponentType<
  IEtoCompletedWidgetProps & IExternalProps
> = ({ goToWallet, columnSpan }) => (
  <Panel columnSpan={columnSpan}>
    <Heading size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="download-agreement-widget.success-title" />
    </Heading>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>
        <FormattedMessage id="download-agreement-widget.success-text" />
      </p>
      <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal" onClick={goToWallet}>
        <FormattedMessage id="download-agreement-widget.go-to-wallet" />
      </ButtonArrowRight>
    </div>
  </Panel>
);

export const UploadInvestmentAgreement = compose<React.FunctionComponent<IExternalProps>>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectIssuerEtoId(state);
      if (etoId) {
        return {
          stateOnChain: selectEtoOnChainStateById(state, etoId)!,
          agreementTemplate: selectEtoDocumentData(state.etoDocuments).allTemplates
            .investmentAndShareholderAgreementTemplate,
          uploadedAgreement: selectUploadedInvestmentAgreement(state),
        };
      } else {
        return null;
      }
    },
    dispatchToProps: dispatch => ({
      downloadAgreementTemplate: (agreementTemplate: IEtoDocument) =>
        dispatch(actions.etoDocuments.generateTemplate(agreementTemplate)),
    }),
  }),
  branch<IStateProps | null>(props => props === null, renderNothing),
  branch<IStateProps>(props => props.stateOnChain < EETOStateOnChain.Signing, renderNothing),
  branch<IStateProps>(props => props.stateOnChain === EETOStateOnChain.Refund, renderNothing),
  branch<IStateProps & IExternalProps>(
    props => props.stateOnChain > EETOStateOnChain.Signing,
    renderComponent(EtoCompletedWidgetLayout),
  ),
  branch<IStateProps & IExternalProps>(
    props => props.uploadedAgreement !== null,
    renderComponent(SignInvestmentAgreement),
  ),
)(UploadInvestmentAgreementLayout);
