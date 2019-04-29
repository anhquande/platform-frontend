import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, FormGroup } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import { getCurrencyByInvestmentType } from "../../../../modules/investment-flow/utils";
import { ETokenType } from "../../../../modules/tx/types";
import { ERoundingMode } from "../../../../utils/Money.utils";
import { Button, ButtonWidth, EButtonLayout } from "../../../shared/buttons/Button.unsafe";
import { CurrencyIcon } from "../../../shared/icons/CurrencyIcon";
import { ECurrency, Money } from "../../../shared/Money.unsafe";

import * as styles from "./InvestmentTypeSelector.module.scss";

interface IWalletBase {
  balanceEur: string;
  icbmBalanceEur?: string;
  name: string;
  enabled?: boolean;
  hasFunds?: boolean;
}

interface IEthWallet extends IWalletBase {
  type: EInvestmentType.ICBMEth | EInvestmentType.Eth;
  balanceEth: string;
  icbmBalanceEth?: string;
}

interface InEuroWallet extends IWalletBase {
  type: EInvestmentType.ICBMnEuro | EInvestmentType.NEur;
  balanceNEuro: string;
  icbmBalanceNEuro?: string;
}

export type WalletSelectionData = IEthWallet | InEuroWallet;

interface IProps {
  wallets: WalletSelectionData[];
  currentType?: EInvestmentType;
  onSelect: (type: EInvestmentType) => void;
  startUpgradeFlow: (token: ETokenType) => void;
}

const WalletBalance: React.FunctionComponent<WalletSelectionData> = wallet => (
  <div className={styles.balance}>
    <div className={styles.balanceValues}>
      <WalletBalanceValues {...wallet} />
    </div>
  </div>
);

const WalletBalanceValues: React.FunctionComponent<WalletSelectionData> = wallet => {
  switch (wallet.type) {
    case EInvestmentType.ICBMEth:
    case EInvestmentType.Eth:
      return (
        <>
          <Money
            currency={ECurrency.ETH}
            value={wallet.enabled ? wallet.balanceEth : wallet.icbmBalanceEth}
            roundingMode={ERoundingMode.DOWN}
          />
          <div className={styles.balanceEur}>
            ={" "}
            <Money
              currency={ECurrency.EUR}
              value={wallet.enabled ? wallet.balanceEur : wallet.icbmBalanceEur}
              roundingMode={ERoundingMode.DOWN}
            />
          </div>
        </>
      );

    case EInvestmentType.NEur:
    case EInvestmentType.ICBMnEuro:
      return (
        <>
          <Money
            currency={ECurrency.EUR_TOKEN}
            value={wallet.enabled ? wallet.balanceNEuro : wallet.icbmBalanceNEuro}
            roundingMode={ERoundingMode.DOWN}
          />
          <div className={styles.balanceEur}>
            ={" "}
            <Money
              currency={ECurrency.EUR}
              value={wallet.enabled ? wallet.balanceEur : wallet.icbmBalanceEur}
              roundingMode={ERoundingMode.DOWN}
            />
          </div>
        </>
      );
  }
};

export class InvestmentTypeSelector extends React.Component<IProps> {
  render(): React.ReactNode {
    const { wallets, currentType, onSelect, startUpgradeFlow } = this.props;
    return (
      <div className={styles.container}>
        {wallets.map(wallet => {
          const checked = currentType === wallet.type;
          const token =
            wallet.type === EInvestmentType.ICBMnEuro ? ETokenType.EURO : ETokenType.ETHER;

          return (
            <Col md="6" key={wallet.type}>
              <FormGroup>
                <label className={cn(styles.wrapper, checked && styles.checked)}>
                  <input
                    className={styles.input}
                    checked={checked}
                    onChange={e => onSelect(e.target.value as EInvestmentType)}
                    type="radio"
                    name="investmentType"
                    value={wallet.type}
                    disabled={!wallet.enabled}
                    data-test-id={`investment-type.selector.${wallet.type}`}
                  />
                  <div className={styles.box}>
                    <CurrencyIcon
                      currency={getCurrencyByInvestmentType(wallet.type)}
                      className={styles.icon}
                    />
                    <div className={styles.label}>
                      {wallet.name}
                      {!wallet.enabled && (
                        <Button
                          layout={EButtonLayout.SIMPLE}
                          theme={"green"}
                          className={styles.enableIcbm}
                          width={ButtonWidth.BLOCK}
                          innerClassName="justify-content-end"
                          onClick={() => startUpgradeFlow(token)}
                          data-test-id={`investment-type.selector.${wallet.type}.enable-wallet`}
                        >
                          <FormattedMessage id="investment-flow.enable-icbm-wallet" />
                        </Button>
                      )}
                    </div>

                    <WalletBalance {...wallet} />
                  </div>
                </label>
              </FormGroup>
            </Col>
          );
        })}
      </div>
    );
  }
}
