import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { getShareAndTokenPrice } from "../../../../lib/api/eto/EtoUtils";
import { ETxSenderType } from "../../../../modules/tx/types";
import { addBigNumbers, multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { formatThousands } from "../../../shared/formatters/utils";
import { TooltipBase } from "../../../shared/tooltips";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";
import {
  formatEthTsd,
  formatEurTsd,
  formatSummaryTokenPrice,
  getActualTokenPriceEur,
} from "./utils";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as info from "../../../../assets/img/notifications/info.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./Summary.module.scss";

const NeuRewardCaption: React.FunctionComponent<{ isIcbm?: boolean }> = ({ isIcbm }) => {
  const neuMsg = <FormattedMessage id="investment-flow.summary.estimated-reward" />;
  const icbmMsg = (
    <>
      {neuMsg}
      <img className={styles.infoIcon} id="tooltip-target-neu" src={info} alt="" />
      <TooltipBase target="tooltip-target-neu">
        <FormattedMessage id="investment-flow.message.no-icbm-neu-reward" />
      </TooltipBase>
    </>
  );
  return isIcbm ? icbmMsg : neuMsg;
};

const InvestmentTransactionDetails: TransactionDetailsComponent<ETxSenderType.INVEST> = ({
  additionalData,
  className,
  txTimestamp,
}) => {
  const equityTokensValue = (
    <span>
      {/* TODO: Change to actual custom token icon */}
      <img src={tokenIcon} alt="" /> {formatThousands(additionalData.equityTokens)}
    </span>
  );
  const estimatedRewardValue = (
    <span>
      <img src={neuIcon} alt="" /> {formatEurTsd(additionalData.estimatedReward)} NEU
    </span>
  );

  const investment = `€ ${formatEurTsd(additionalData.investmentEur)} ≈ ${formatEthTsd(
    additionalData.investmentEth,
  )} ETH`;

  const gasCostEuro = multiplyBigNumbers([additionalData.gasCostEth, additionalData.etherPriceEur]);
  const totalCostEth = addBigNumbers([additionalData.gasCostEth, additionalData.investmentEth]);
  const totalCostEur = addBigNumbers([gasCostEuro, additionalData.investmentEur]);

  const total = `€ ${formatEurTsd(totalCostEur)} ≈ ${formatEthTsd(totalCostEth)} ETH`;

  const actualTokenPrice = getActualTokenPriceEur(
    additionalData.investmentEur,
    additionalData.equityTokens,
  );
  const { tokenPrice: fullTokenPrice } = getShareAndTokenPrice({
    preMoneyValuationEur: additionalData.eto.preMoneyValuationEur,
    existingCompanyShares: additionalData.eto.existingCompanyShares,
    equityTokensPerShare: additionalData.eto.equityTokensPerShare,
  });
  const formattedTokenPrice = `€ ${formatSummaryTokenPrice(
    fullTokenPrice.toString(),
    actualTokenPrice,
  )}`;

  return (
    <InfoList className={className}>
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.company" />}
        value={additionalData.eto.companyName}
      />
      <InfoRow
        data-test-id="investment-summary-token-price"
        caption={<FormattedMessage id="investment-flow.summary.token-price" />}
        value={formattedTokenPrice}
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.eto-address" />}
        value={additionalData.eto.etoId}
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.your-investment" />}
        value={investment}
        data-test-id="invest-modal-summary-your-investment"
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.transaction-cost" />}
        value={`${formatEthTsd(additionalData.gasCostEth)} ETH`}
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.equity-tokens" />}
        value={equityTokensValue}
      />
      <InfoRow
        caption={<NeuRewardCaption isIcbm={additionalData.isIcbm} />}
        value={estimatedRewardValue}
      />
      <InfoRow
        caption={<FormattedMessage id="investment-flow.summary.transaction-value" />}
        value={total}
      />

      {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
    </InfoList>
  );
};

export { InvestmentTransactionDetails };
