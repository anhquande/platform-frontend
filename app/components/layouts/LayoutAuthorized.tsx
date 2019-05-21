import * as React from "react";

import { AcceptTosModal } from "../modals/accept-tos-modal/AcceptTosModal";
import { BankTransferFlowModal } from "../modals/bank-transfer-flow/BankTransferFlow";
import { DepositEthModal } from "../modals/DepositEthModal";
import { DownloadTokenAgreementModal } from "../modals/download-token-agreements-modal/DownloadTokenAgreementModal";
import { IcbmWalletBalanceModal } from "../modals/icbm-wallet-balance-modal/IcbmWalletBalanceModal.unsafe";
import { TxSenderModal } from "../modals/tx-sender/TxSender";
import { NotificationWidget } from "../shared/notification-widget/NotificationWidget";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./header/Header";
import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu.unsafe";
import { layoutEnhancer } from "./LayoutEnhancer";

import * as styles from "./LayoutAuthorized.module.scss";

export const LayoutAuthorizedComponent: React.FunctionComponent = ({ children }) => (
  <div className={styles.layout}>
    <Header />
    <LayoutAuthorizedMenu />
    <Content>
      <NotificationWidget />
      {children}
    </Content>
    <Footer />
    <AcceptTosModal />
    <DepositEthModal />
    <TxSenderModal />
    <IcbmWalletBalanceModal />
    <BankTransferFlowModal />
    <DownloadTokenAgreementModal />
  </div>
);

export const LayoutAuthorized = layoutEnhancer(LayoutAuthorizedComponent);
