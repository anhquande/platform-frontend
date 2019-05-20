import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { testEto } from "../../../../../test/fixtures";
import { Q18 } from "../../../../config/constants";
import { EEtoState } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IBookBuildingStats } from "../../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { ICalculatedContribution } from "../../../../modules/investor-portfolio/types";
import { withStore } from "../../../../utils/storeDecorator.unsafe";
import { withMockedDate } from "../../../../utils/storybookHelpers.unsafe";
import { EtoOverviewThumbnail } from "./EtoOverviewThumbnail";

const rootEto: TEtoWithCompanyAndContract = {
  ...testEto,
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  maxPledges: 100,
  maxTicketEur: 1000,
  minTicketEur: 1,
  equityTokenName: "TokenName",
  equityTokenSymbol: "TKN",
};

const commonProps = {
  isAuthorized: true,
  isEligibleToPreEto: false,
  maxCapExceeded: false,
  navigateToEto: action("navigateToEto"),
  openInNewWindow: action("openInNewWindow"),
  showQuote: false,
};

// 2018-11-16T05:03:56.000Z
// Fri Nov 23 2018 06:03:56 GMT+0100
const dummyNow = new Date("2018-10-16T05:03:56+00:00");

const withEto = ({
  eto,
  bookbuildingStats,
  calculatedContributions,
}: {
  eto: TEtoWithCompanyAndContract;
  bookbuildingStats?: IBookBuildingStats;
  calculatedContributions?: ICalculatedContribution;
}) =>
  withStore({
    eto: {
      etos: { [eto.previewCode]: eto },
      companies: { [eto.companyId]: eto.company },
      contracts: { [eto.previewCode]: eto.contract },
    },
    bookBuildingFlow: bookbuildingStats && {
      bookbuildingStats: {
        [eto.etoId]: bookbuildingStats,
      },
    },
    investorTickets: calculatedContributions && {
      calculatedContributions: {
        [eto.etoId]: calculatedContributions,
      },
    },
  })(() => <EtoOverviewThumbnail {...commonProps} eto={eto} />);

storiesOf("ETO/EtoOverviewThumbnail", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("coming soon", () => {
    const eto = {
      ...rootEto,
      state: EEtoState.PREVIEW,
    };

    return withEto({ eto });
  })
  .add("whitelisting", () => {
    const eto = {
      ...rootEto,
      isBookbuilding: true,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    const bookbuildingStats = {
      pledgedAmount: 100000,
      investorsCount: 40,
    };

    return withEto({ eto, bookbuildingStats });
  })
  .add("countdown to presale", () => {
    const eto = {
      ...rootEto,
      isBookbuilding: false,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    const calculatedContributions = {
      isEligible: true,
      minTicketEurUlps: Q18.mul("10"),
      maxTicketEurUlps: Q18.mul("10000"),
      neuRewardUlps: Q18.mul("1000"),
      equityTokenInt: new BigNumber(1000),
      maxCapExceeded: false,
      isWhitelisted: true,
    };
    return withEto({ eto, calculatedContributions });
  })
  .add("presale", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Whitelist,
      },
    };

    const calculatedContributions = {
      isEligible: true,
      minTicketEurUlps: Q18.mul("10"),
      maxTicketEurUlps: Q18.mul("10000"),
      neuRewardUlps: Q18.mul("1000"),
      equityTokenInt: new BigNumber(1000),
      maxCapExceeded: false,
      isWhitelisted: true,
    };
    return withEto({
      eto,
      calculatedContributions,
    });
  })
  .add("countdown to public sale", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Whitelist,
      },
    };

    return withEto({
      eto,
    });
  })
  .add("public sale", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Public,
      },
    };

    return withEto({ eto });
  })
  .add("in signing", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Signing,
      },
    };

    return withEto({ eto });
  })
  .add("claim", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Claim,
      },
    };

    return withEto({ eto });
  })
  .add("payout", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Payout,
      },
    };

    return withEto({ eto });
  })
  .add("refund", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Refund,
      },
    };

    return withEto({ eto });
  });
