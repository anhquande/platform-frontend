import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { selectEurValueUlps } from "../../../../modules/investmentFlow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectEtoWithCompanyAndContractById,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/public-etos/selectors";
import { appConnect } from "../../../../store";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney } from "../../../../utils/Money.utils";
import { DocumentLink } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";
import { formatEur } from "./utils";

interface IProps {
  companyName: string;
  investmentEur: string;
  equityTokens: string;
  estimatedReward: string;
  summaryDocumentUrl: string;
}

const BankTransferSummaryComponent = injectIntlHelpers((data: IProps & IIntlProps) => {
  const equityTokens = (
    <span>
      {/* TODO: Change to actual custom token icon */}
      <img src={tokenIcon} /> {data.equityTokens}
    </span>
  );
  const estimatedReward = (
    <span>
      <img src={neuIcon} /> {formatEur(data.estimatedReward)} NEU
    </span>
  );

  const tokenPrice = divideBigNumbers(data.investmentEur, data.equityTokens);

  return (
    <Container className={styles.container}>
      <Row className="mt-0">
        <Col>
          <Heading>
            <FormattedMessage id="investment-flow.investment-summary" />
          </Heading>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>
            <FormattedMessage id="investment-flow.bank-transfer-summary.explanation" />
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <InfoList>
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.company" />}
              value={data.companyName}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.summary.token-price" />}
              value={`${formatMoney(tokenPrice, MONEY_DECIMALS, 2)} €`}
            />
            <InfoRow
              caption={
                <FormattedMessage id="investment-flow.bank-transfer-summary.estimated-investment" />
              }
              value={`${formatEur(data.investmentEur)} €`}
            />
            <InfoRow
              caption={
                <FormattedMessage id="investment-flow.bank-transfer-summary.equity-tokens" />
              }
              value={equityTokens}
            />
            <InfoRow
              caption={<FormattedMessage id="investment-flow.bank-transfer-summary.neu-reward" />}
              value={estimatedReward}
            />
          </InfoList>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <DocumentLink
          url={data.summaryDocumentUrl}
          name={<FormattedMessage id="investment-flow.bank-transfer-summary.investment-summary" />}
        />
      </Row>
    </Container>
  );
});

const BankTransferSummary = appConnect<IProps>({
  stateToProps: state => {
    const i = state.investmentFlow;
    const p = state.publicEtos;
    // eto and computed values are guaranteed to be present at investment summary state
    const eto = selectEtoWithCompanyAndContractById(state, i.etoId)!;
    return {
      summaryDocumentUrl: "fufu", // TODO: add proper agreement document link
      companyName: eto.company.name,
      investmentEur: selectEurValueUlps(i),
      equityTokens: selectEquityTokenCountByEtoId(i.etoId, p) as string,
      estimatedReward: selectNeuRewardUlpsByEtoId(i.etoId, p) as string,
    };
  },
})(BankTransferSummaryComponent);

export { BankTransferSummaryComponent, BankTransferSummary };