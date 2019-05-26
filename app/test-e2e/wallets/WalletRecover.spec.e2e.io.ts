import { recoverRoutes } from "../../components/wallet-selector/wallet-recover/router/recoverRoutes";
import {
  acceptTOS,
  assertDashboard,
  assertErrorModal,
  assertWaitForLatestEmailSentWithSalt,
  typeEmailPassword,
  typeLightwalletRecoveryPhrase,
  verifyLatestUserEmail,
} from "../utils";
import { cyPromise } from "../utils/cyPromise";
import { generateRandomSeedAndAddress } from "../utils/generateRandomSeedAndAddress";
import { tid } from "../utils/selectors";
import { generateRandomEmailAddress, createAndLoginNewUser } from "../utils/userHelpers";
import { INV_ETH_ICBM_NO_KYC, INV_EUR_ICBM_HAS_KYC_SEED } from "../fixtures";

describe("Wallet recover", () => {
  it("should recover wallet from saved phrases", () => {
    cyPromise(() => generateRandomSeedAndAddress("m/44'/60'/0'")).then(
      ({ seed: words, address: expectedGeneratedAddress }) => {
        const email = generateRandomEmailAddress();

        cy.visit(`${recoverRoutes.seed}`);

        typeLightwalletRecoveryPhrase(words);

        cy.get(tid("wallet-selector-register-email")).type(email);
        cy.get(tid("wallet-selector-register-password")).type("strongpassword");
        cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");

        cy.get(tid("recovery-success-btn-go-dashboard")).awaitedClick();

        assertWaitForLatestEmailSentWithSalt(email);

        cy.contains(tid("my-neu-widget-neumark-balance.large-value"), "0 NEU");

        cy.contains(tid("my-wallet-widget-eur-token.large-value"), "0 nEUR");
        cy.contains(tid("my-wallet-widget-eur-token.value"), "0 EUR");

        acceptTOS();

        cy.get(tid("authorized-layout-profile-button")).click();
        cy.get(tid("account-address.your.ether-address.from-div")).then(value => {
          expect(value[0].innerText.toLowerCase()).to.equal(expectedGeneratedAddress);
        });
      },
    );
  });

  it("should return an error when recovering seed and using an already verified email", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      cy.window().then(async window => {
        // TODO: move into a seperate util method
        const metaData = JSON.parse(await window.localStorage.getItem("NF_WALLET_METADATA"));
        cy.clearLocalStorage().then(() => {
          cy.visit(`${recoverRoutes.seed}`);
          typeLightwalletRecoveryPhrase(INV_ETH_ICBM_NO_KYC.split(" "));
          typeEmailPassword(metaData.email, "randomPassword");

          assertErrorModal();
        });
      });
    });
  });

  it("should recover user with same email if its the same user", () => {
    cyPromise(() => generateRandomSeedAndAddress("m/44'/60'/0'")).then(({ seed }) => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "individual",
        seed: seed.join(" "),
      }).then(() => {
        const email = generateRandomEmailAddress();
        const password = "strongpassword";
        cy.clearLocalStorage();
        cy.visit(`${recoverRoutes.seed}`);

        typeLightwalletRecoveryPhrase(seed);
        typeEmailPassword(email, password);
        cy.wait(1000);
        cy.get(tid("recovery-success-btn-go-dashboard")).awaitedClick();

        assertDashboard();
      });
    });
  });

  it("should recover existing user with verified email from saved phrases and change email", () => {
    cyPromise(() => generateRandomSeedAndAddress("m/44'/60'/0'")).then(({ seed }) => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "individual",
        seed: seed.join(" "),
      }).then(() => {
        {
          const email = generateRandomEmailAddress();
          const password = "strongpassword";

          cy.clearLocalStorage().then(() => {
            cy.visit(recoverRoutes.seed);

            typeLightwalletRecoveryPhrase(seed);

            typeEmailPassword(email, password);
            cy.wait(1000);
            assertWaitForLatestEmailSentWithSalt(email);

            cy.get(tid("recovery-success-btn-go-dashboard")).awaitedClick();

            assertDashboard();
          });
        }
      });
    });
  });
});
