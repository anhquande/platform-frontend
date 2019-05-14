import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { selectEtoSubState, selectEtoWithCompanyAndContract } from "../../../modules/eto/selectors";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";

import * as styles from "./ETOState.module.scss";

export enum EProjectStatusSize {
  MEDIUM = "medium",
  LARGE = "large",
  SMALL = "small",
}

export enum EProjectStatusLayout {
  NORMAL = "normal",
  BLACK = "black",
}

export enum EProjectStatusType {
  NORMAL = "normal",
  EXTENDED = "extended",
}

interface IExternalProps {
  size?: EProjectStatusSize;
  layout?: EProjectStatusLayout;
  type?: EProjectStatusType;
  previewCode: string;
}

interface IStateProps {
  eto: TEtoWithCompanyAndContract;
  subState: EEtoSubState | undefined;
}

export const statusToName: Record<
  EEtoState | EETOStateOnChain | EEtoSubState,
  React.ReactElement<FormattedMessage>
> = {
  [EEtoState.PREVIEW]: <FormattedMessage id="shared-component.eto-overview.status-in-preview" />,
  [EEtoState.PENDING]: <FormattedMessage id="shared-component.eto-overview.status-in-review" />,
  [EEtoState.LISTED]: <FormattedMessage id="shared-component.eto-overview.status-listed" />,
  [EEtoState.PROSPECTUS_APPROVED]: (
    <FormattedMessage id="shared-component.eto-overview.status-prospectus-approved" />
  ),
  [EEtoState.ON_CHAIN]: <FormattedMessage id="shared-component.eto-overview.status-on-chain" />,

  // on chain state mappings
  [EETOStateOnChain.Setup]: <FormattedMessage id="eto.status.onchain.setup" />,
  [EETOStateOnChain.Whitelist]: <FormattedMessage id="eto.status.onchain.whitelist" />,
  [EETOStateOnChain.Public]: <FormattedMessage id="eto.status.onchain.public" />,
  [EETOStateOnChain.Signing]: <FormattedMessage id="eto.status.onchain.signing" />,
  [EETOStateOnChain.Claim]: <FormattedMessage id="eto.status.onchain.claim" />,
  [EETOStateOnChain.Payout]: <FormattedMessage id="eto.status.onchain.payout" />,
  [EETOStateOnChain.Refund]: <FormattedMessage id="eto.status.onchain.refund" />,

  // on chain sub state mappings
  [EEtoSubState.COMING_SOON]: <FormattedMessage id="eto.status.sub-state.coming-soon" />,
  [EEtoSubState.COUNTDOWN_TO_PRESALE]: (
    <FormattedMessage id="eto.status.sub-state.countdown-to-presale" />
  ),
  [EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE]: (
    <FormattedMessage id="eto.status.sub-state.countdown-to-public-sale" />
  ),
};

const stateToClassName: Partial<Record<EEtoState | EETOStateOnChain, string>> = {
  [EEtoState.PENDING]: styles.pending,
  [EEtoState.LISTED]: styles.listed,
  [EETOStateOnChain.Refund]: styles.refund,
  [EETOStateOnChain.Signing]: styles.signing,
};

const ETOStateLayout: React.FunctionComponent<IStateProps & IExternalProps & CommonHtmlProps> = ({
  eto,
  subState,
  className,
  size = EProjectStatusSize.MEDIUM,
  layout = EProjectStatusLayout.NORMAL,
  type = EProjectStatusType.NORMAL,
}) => {
  const status = eto.contract ? eto.contract.timedState : eto.state;

  return (
    <div
      className={cn(styles.projectStatus, stateToClassName[status], size, layout, className)}
      data-test-id={`eto-state-${status}`}
    >
      {type === EProjectStatusType.EXTENDED && subState
        ? statusToName[subState]
        : statusToName[status]}
    </div>
  );
};

export const ETOState = appConnect<IStateProps, {}, IExternalProps & CommonHtmlProps>({
  stateToProps: (state, props) => ({
    eto: selectEtoWithCompanyAndContract(state, props.previewCode)!,
    subState: selectEtoSubState(state, props.previewCode)!,
  }),
})(ETOStateLayout);
