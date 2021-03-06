import BigNumber from "bignumber.js";
import { expect } from "chai";
import * as sinon from "sinon";

import { Q18 } from "../../../config/constants";
import * as etoUtils from "../../../lib/api/eto/EtoUtils";
import { IAppState } from "../../../store";
import { convertToBigInt } from "../../../utils/Number.utils";
import * as etoSelectors from "../../eto/selectors";
import { IInvestorTicketsState } from "../reducer";
import * as investorTicketSelectors from "../selectors";
import { ITokenDisbursal } from "../types";

describe("investor-portfolio > selectors", () => {
  describe("selectCalculatedEtoTicketSizesById", () => {
    beforeEach(() => {
      sinon.stub(etoSelectors, "selectEtoById").returns({
        minTicketEur: 10,
        maxTicketEur: 1000,
      });
      sinon.stub(investorTicketSelectors, "selectCalculatedContribution").returns({
        minTicketEurUlps: new BigNumber("20").mul(Q18),
        maxTicketEurUlps: new BigNumber("2000").mul(Q18),
      });
      sinon.stub(investorTicketSelectors, "selectInvestorTicket").returns(undefined);
      sinon.stub(etoUtils, "getShareAndTokenPrice").returns({ tokenPrice: 1.5 });
    });

    afterEach(() => {
      (etoSelectors.selectEtoById as sinon.SinonStub).restore();
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).restore();
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).restore();
      (etoUtils.getShareAndTokenPrice as sinon.SinonStub).restore();
    });

    // tslint:disable-next-line:no-object-literal-type-assertion
    const state = {} as IAppState;
    const etoId = "";
    const selectCalculatedEtoTicketSizesUlpsById =
      investorTicketSelectors.selectCalculatedEtoTicketSizesUlpsById;

    it("returns undefined if not eto or calculatedContribution are found", () => {
      (etoSelectors.selectEtoById as sinon.SinonStub).returns(undefined);
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).returns(undefined);
      // tslint:disable-next-line:no-unused-expression
      expect(selectCalculatedEtoTicketSizesUlpsById(state, etoId)).to.be.undefined;
    });

    it("returns eto ticket sizes if eto is defined", () => {
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).returns(undefined);

      const result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("10").mul(Q18),
        maxTicketEurUlps: new BigNumber("1000").mul(Q18),
      });
    });

    it("returns eto ticket sizes if calculatedContribution is defined", () => {
      const result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("20").mul(Q18),
        maxTicketEurUlps: new BigNumber("2000").mul(Q18),
      });
    });

    it("returns reduces amount by investor ticket", () => {
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).returns({
        equivEurUlps: new BigNumber(18).mul(Q18),
      });
      const result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("2").mul(Q18),
        maxTicketEurUlps: new BigNumber("1982").mul(Q18),
      });
    });

    it("returns at least ticket size", () => {
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).returns({
        equivEurUlps: new BigNumber(30).mul(Q18),
      });
      let result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("1.5").mul(Q18),
        maxTicketEurUlps: new BigNumber("1970").mul(Q18),
      });

      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).returns({
        equivEurUlps: new BigNumber(3000).mul(Q18),
      });
      result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("1.5").mul(Q18),
        maxTicketEurUlps: new BigNumber("0"),
      });
    });
  });

  describe("selectIsIncomingPayoutAvailable", () => {
    it("should show if amount equals 1 ETH", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: "0",
              etherTokenIncomingPayoutValue: convertToBigInt("1"),
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutAvailable(state)).to.be.true;
    });

    it("should show if amount is more than 1 ETH", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: "0",
              etherTokenIncomingPayoutValue: convertToBigInt("123"),
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutAvailable(state)).to.be.true;
    });

    it("should show if amount equals 100 nEUR", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: convertToBigInt("100"),
              etherTokenIncomingPayoutValue: "0",
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutAvailable(state)).to.be.true;
    });

    it("should show if amount is more than 100 nEUR", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: convertToBigInt("12452"),
              etherTokenIncomingPayoutValue: "0",
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutAvailable(state)).to.be.true;
    });

    it("should not show if amount is less than 100 nEUR and 1 ETH", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: convertToBigInt("50"),
              etherTokenIncomingPayoutValue: convertToBigInt("0.4"),
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutAvailable(state)).to.be.false;
    });
  });

  describe("selectTokensDisbursal", () => {
    const euroTokendDisbursal = {
      token: "eur_t",
      amountToBeClaimed: "499807466992079716049",
      totalDisbursedAmount: convertToBigInt("97154.607"),
      timeToFirstDisbursalRecycle: 1680747704000,
    };

    const ethDisbursal = {
      token: "eth",
      amountToBeClaimed: "187494227249274600",
      totalDisbursedAmount: "364458900000000000",
      timeToFirstDisbursalRecycle: 1680747704000,
    };

    it("should render both nEUR and ETH to be claimed", () => {
      const state = {
        investorTickets: {
          tokensDisbursal: [euroTokendDisbursal, ethDisbursal] as ITokenDisbursal[],
        } as IInvestorTicketsState,
      } as IAppState;

      const data = investorTicketSelectors.selectTokensDisbursal(state);

      expect(data).to.be.lengthOf(2);
      expect(data).to.contain(ethDisbursal);
      expect(data).to.contain(euroTokendDisbursal);
    });

    it("should return only ETH to be claimed", () => {
      // amount of 0.90 nEUR
      const state = {
        investorTickets: {
          tokensDisbursal: [
            { ...euroTokendDisbursal, amountToBeClaimed: convertToBigInt("0.90") },
            ethDisbursal,
          ] as ITokenDisbursal[],
        } as IInvestorTicketsState,
      } as IAppState;

      const data = investorTicketSelectors.selectTokensDisbursal(state);

      expect(data).to.be.lengthOf(1);
      expect(data).to.contain(ethDisbursal);
    });

    it("should return only nEUR to be claimed", () => {
      // amount of 0.00023 ETH
      const state = {
        investorTickets: {
          tokensDisbursal: [
            euroTokendDisbursal,
            { ...ethDisbursal, amountToBeClaimed: convertToBigInt("0.00023") },
          ] as ITokenDisbursal[],
        } as IInvestorTicketsState,
      } as IAppState;

      const data = investorTicketSelectors.selectTokensDisbursal(state);

      expect(data).to.be.lengthOf(1);
      expect(data).to.contain(euroTokendDisbursal);
    });
  });
});
