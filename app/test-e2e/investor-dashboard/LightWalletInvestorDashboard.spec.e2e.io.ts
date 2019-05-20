import * as moment from "moment";

import { convertToBigInt } from "../../utils/Number.utils";
import { assertMoneyNotEmpty } from "../utils";
import { goToDashboard, goToDashboardWithRequiredPayoutAmountSet } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Auto Login", () => {
  it("will auto login", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();
    });
  });
});

describe("Incoming payout", () => {
  it("should show counter with incoming payout value", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      cy.get(tid("incoming-payout-counter"));

      assertMoneyNotEmpty("incoming-payout-euro-token");

      assertMoneyNotEmpty("incoming-payout-ether-token");
    });
  });

  it("should change view after incoming payout complete", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      let clock: any = null;
      goToDashboard();

      cy.get(tid("incoming-payout-counter"));

      const counterTime = moment()
        .utc()
        .endOf("day")
        .subtract(10, "seconds")
        .toDate()
        .getTime();
      // workaround for not working this.clock.restore() outside clock promise
      cy.clock(counterTime).then(cl => (clock = cl));
      cy.tick(11 * 1000);

      cy.get(tid("incoming-payout-done"));

      cy.get(tid("incoming-payout-go-to-portfolio"))
        .click()
        .then(() => {
          // restore clock to have portfolio loaded
          clock.restore();
        });

      cy.url().should("include", "/portfolio");
    });
  });

  it("Should show counter without ETH", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboardWithRequiredPayoutAmountSet(false, convertToBigInt("1000"));

      cy.get(tid("incoming-payout-counter"));

      assertMoneyNotEmpty("incoming-payout-euro-token");

      cy.get(tid("incoming-payout-ether-token")).should("not.exist");
    });
  });
});
