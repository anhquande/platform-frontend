import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { EETOStateOnChain } from "../../modules/eto/types";
import { IInvestorTicket, TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { PortfolioPastInvestments } from "./PortfolioPastInvestments";

const eto = {
  ...testEto,
  contract: {
    ...testEto.contract,
    timedState: EETOStateOnChain.Payout,
  },
  investorTicket: {
    equivEurUlps: new BigNumber("738464183130318387747"),
    rewardNmkUlps: new BigNumber("0"),
    equityTokenInt: new BigNumber("2280"),
    sharesInt: new BigNumber("228000000000000000"),
    tokenPrice: new BigNumber("323887799618560696"),
    neuRate: new BigNumber("0"),
    amountEth: new BigNumber("4716210000000000000"),
    amountEurUlps: new BigNumber("0"),
    claimedOrRefunded: true,
    usedLockedAccount: true,
  } as IInvestorTicket,
} as TETOWithInvestorTicket;

storiesOf("Portfolio/PortfolioPastInvestments", module)
  .addDecorator(
    withStore({
      eto: {
        etos: { [eto.previewCode]: eto },
        contracts: { [eto.previewCode]: eto.contract },
        companies: { [eto.previewCode]: {} },
      },
    }),
  )
  .add("without past investments", () => <PortfolioPastInvestments pastInvestments={[]} />)
  .add("with past investments", () => <PortfolioPastInvestments pastInvestments={[eto]} />);
