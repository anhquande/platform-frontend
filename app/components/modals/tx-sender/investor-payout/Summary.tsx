import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import { ITokenDisbursal } from "../../../../modules/investor-portfolio/types";
import { selectTxSummaryAdditionalData } from "../../../../modules/tx/sender/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { EthereumAddressWithChecksum } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { Button } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { Money, selectCurrencyCode } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

import * as styles from "./Summary.module.scss";

interface IStateProps {
  tokensDisbursal: ITokenDisbursal[];
  walletAddress: EthereumAddressWithChecksum;
}

interface IDispatchProps {
  onAccept: () => any;
}

type TComponentProps = IStateProps & IDispatchProps;

const InvestorPayoutSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  walletAddress,
  tokensDisbursal,
  onAccept,
}) => {
  return (
    <Container>
      <Heading className="mb-4">
        <FormattedMessage id="investor-payout.summary.title" />
      </Heading>

      <p className="mb-3">
        {tokensDisbursal.length === 1 ? (
          <FormattedMessage
            id="investor-payout.summary.single.description"
            values={{ token: selectCurrencyCode(tokensDisbursal[0].token) }}
          />
        ) : (
          <FormattedMessage id="investor-payout.summary.combined.description" />
        )}
      </p>
      <InfoList className="mb-4">
        {tokensDisbursal.map(disbursal => (
          <InfoRow
            key={disbursal.token}
            caption={
              <FormattedMessage
                id="investor-payout.summary.total-payout"
                values={{ token: selectCurrencyCode(disbursal.token) }}
              />
            }
            value={<Money value={disbursal.amountToBeClaimed} currency={disbursal.token} />}
          />
        ))}
      </InfoList>
      <section className="text-center">
        <a
          className="d-inline-block mb-3"
          href={withParams(externalRoutes.commitmentStatus, { walletAddress })}
        >
          <FormattedMessage id="investor-payout.summary.neu-tokenholder-agreement" />
        </a>
        <p className={cn(styles.hint)}>
          <FormattedMessage id="investor-payout.summary.hint" />
        </p>
        <Button onClick={onAccept}>
          <FormattedMessage id="investor-payout.summary.accept" />
        </Button>
      </section>
    </Container>
  );
};

const InvestorPayoutSummary = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => ({
    walletAddress: selectEthereumAddressWithChecksum(state),
    tokensDisbursal: selectTxSummaryAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(InvestorPayoutSummaryLayout);

export { InvestorPayoutSummary, InvestorPayoutSummaryLayout };
