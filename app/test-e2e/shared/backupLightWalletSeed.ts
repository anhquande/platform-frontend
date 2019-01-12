import { tid } from "../utils";

const navigateToProfile = () => cy.get(tid("authorized-layout-profile-button")).awaitedClick();

const extractSeedFromDOM = (seed: string): string[] =>
  seed
    .replace(/\d/g, "")
    .replace(/[.]/g, " ")
    .split(" ");

const extractRandomWordIndexFromDOM = (indexArray: string): string[] =>
  indexArray.replace(/[a-z]/g, "").split(" ");

export const backupLightWalletSeed = () => {
  navigateToProfile();

  cy.get(tid("backup-seed-widget-link-button")).awaitedClick();
  cy.get(tid("access-light-wallet-prompt-accept-button")).awaitedClick();
  cy.get(tid("backup-seed-intro-button")).awaitedClick();

  cy.get(tid("seed-display-word")).then(word => {
    const firstSeed = extractSeedFromDOM(word.text());
    firstSeed.shift();

    const seed = firstSeed;
    cy.get(tid("seed-display-next-link")).awaitedClick();

    cy.get(tid("seed-verify-label")).then(randomWords => {
      const randomEnt = extractRandomWordIndexFromDOM(randomWords.text());
      randomEnt.shift();
      for (let index = 0; index < 4; index++) {
        cy.get(tid(`backup-seed-verify-word-${index}`, "input"))
          .type(seed[Number.parseInt(randomEnt[index], 10) - 1], { force: true, timeout: 20 })
          .type("{enter}", { force: true });
      }

      cy.get(tid("seed-verify-button-next")).awaitedClick();
      cy.get(tid("generic-modal-dismiss-button")).awaitedClick();

      cy.get(tid("backup-seed-verified-section")).should("exist");
    });
  });
};
