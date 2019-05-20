import * as LightWalletProvider from "eth-lightwallet";
import * as ethSig from "eth-sig-util";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { toChecksumAddress } from "web3-utils";

import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TxPendingWithMetadata, TxWithMetadata } from "../../lib/api/users/interfaces";
import { getVaultKey } from "../../modules/wallet-selector/light-wizard/utils";
import { promisify } from "../../utils/promisify";
import { toCamelCase } from "../../utils/transformObjectKeys";
import { tid } from "./selectors";

/*
 * Pre-login user for faster tests
 */
const VAULT_API_ROOT = "/api/wallet";
export const INVESTOR_WALLET_KEY = "NF_WALLET_METADATA";
const ISSUER_WALLET_KEY = "NF_WALLET_ISSUER_METADATA";
export const JWT_KEY = "NF_JWT";
const CURRENT_AGREEMENT = "QmS3qGWqvruywjM7Lp82LiyoyqDQbArdXveC5JA5m54Qfv";

export const generateRandomEmailAddress = () =>
  `${Math.random()
    .toString(36)
    .substring(7)}@e2e.com`;

export const createAndLoginNewUser = (params: {
  type: "investor" | "issuer";
  kyc?: "business" | "individual";
  seed?: string;
  hdPath?: string;
  clearPendingTransactions?: boolean;
  onlyLogin?: boolean;
  signTosAgreement?: boolean;
  permissions?: string[];
}) =>
  cy.clearLocalStorage().then(async ls => {
    cy.log("Logging in...");

    const {
      lightWalletInstance,
      salt,
      address,
      privateKey,
      walletKey,
    } = await createLightWalletWithKeyPair(params.seed, params.hdPath);

    // set wallet data on local storage
    ls.setItem(
      params.type === "investor" ? INVESTOR_WALLET_KEY : ISSUER_WALLET_KEY,
      JSON.stringify({
        address,
        email: `${address.slice(0, 7)}@neufund.org`,
        salt: salt,
        walletType: "LIGHT",
      }),
    );

    // fetch a token and store it in local storage
    const jwt = await getJWT(address, lightWalletInstance, walletKey, params.permissions);
    ls.setItem(JWT_KEY, `"${jwt}"`);
    await createVaultApi(salt, DEFAULT_PASSWORD, lightWalletInstance.serialize());

    if (!params.onlyLogin) {
      // create a user object on the backend
      await createUser(privateKey, params.type, params.kyc);

      // mark backup codes verified
      await markBackupCodesVerified(jwt);
      // set correct agreement

      if (params.clearPendingTransactions) {
        clearPendingTransactions();
      }

      cy.log(
        `Logged in as ${params.type}`,
        `KYC: ${params.kyc}, clearPendingTransactions: ${params.clearPendingTransactions}, seed: ${
          params.seed
        }`,
      );
    }

    if (params.signTosAgreement || !params.onlyLogin) {
      // This was done to maintain introduce `signTosAgreement` without changing the interface of existing tests
      await setCorrectAgreement(jwt);
    }
  });

/**
 * Create a light wallet with a given seed
 * @param seed
 */
export const DEFAULT_PASSWORD = "strongpassword";
export const DEFAULT_HD_PATH = "m/44'/60'/0'";
export const createLightWalletWithKeyPair = async (
  seed?: string,
  hdPathString: string = DEFAULT_HD_PATH,
) => {
  // promisify some stuff
  const create = promisify<any>(LightWalletProvider.keystore.createVault);

  // create a new wallet
  const entropyStrength = 256;
  seed = seed ? seed : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
  const salt = LightWalletProvider.keystore.generateSalt(32);
  const lightWalletInstance = await create({
    password: DEFAULT_PASSWORD,
    seedPhrase: seed,
    hdPathString,
    salt,
  });

  // create keypair
  const keyFromPassword = promisify<any>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  const walletKey: any = await keyFromPassword(DEFAULT_PASSWORD);
  lightWalletInstance.generateNewAddress(walletKey, 1);
  let address = lightWalletInstance.getAddresses()[0];
  address = toChecksumAddress(address);
  const privateKey = lightWalletInstance.exportPrivateKey(address, walletKey);

  return { lightWalletInstance, salt, address, privateKey, walletKey };
};

/**
 * Create a user object with the dev services
 * User will have an accepted email address as well as
 * an accepted kyc, if requested
 */
const CREATE_USER_PATH = "/api/external-services-mock/e2e-tests/user/";

export const createUser = (
  privateKey: string,
  userType: "investor" | "issuer",
  kyc?: "business" | "individual",
) => {
  let path = `${CREATE_USER_PATH}?private_key=0x${privateKey}&user_type=${userType}`;
  if (kyc) {
    path += `&kyc=${kyc}`;
  }

  return fetch(path, {
    method: "POST",
  });
};

/**
 * Get a jwt from the server
 * This could maybe be replaced by a called to the mockservices
 */
const CHALLENGE_PATH = "/api/signature/jwt/challenge";
const JWT_PATH = "/api/signature/jwt/create";

export const getJWT = async (
  address: string,
  lightWalletInstance: any,
  walletKey: any,
  permissions: string[] = [],
): Promise<string> => {
  // first get a challenge
  const headers = {
    "Content-Type": "application/json",
  };
  const challenge_body = {
    address,
    salt: "4abc08069f8c6d26becd80fe96fbeaf4d17b84cdbe7071a8197ab5370bb85876",
    signer_type: "eth_sign",
    permissions: ["sign-tos", ...permissions],
  };
  const ch_response = await fetch(CHALLENGE_PATH, {
    headers,
    method: "POST",
    body: JSON.stringify(challenge_body),
  });
  const ch_result = await ch_response.json();
  const challenge = ch_result.challenge;

  // now sign it...
  const msgHash = hashPersonalMessage(toBuffer(addHexPrefix(challenge)));
  const rawSignedMsg = await LightWalletProvider.signing.signMsgHash(
    lightWalletInstance,
    walletKey,
    msgHash.toString("hex"),
    address,
  );

  // ... and request the jwt
  const signedChallenge = ethSig.concatSig(rawSignedMsg.v, rawSignedMsg.r, rawSignedMsg.s);
  const signed_body = {
    challenge,
    response: signedChallenge,
    signer_type: "eth_sign",
  };
  const sig_response = await fetch(JWT_PATH, {
    headers,
    method: "POST",
    body: JSON.stringify(signed_body),
  });
  const sig_result = await sig_response.json();
  return sig_result.jwt;
};

const USER_PATH = "/api/user/user/me";
const USER_TOS_PATH = USER_PATH + "/tos";

export const markBackupCodesVerified = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };
  const response = await fetch(USER_PATH, {
    headers,
    method: "GET",
  });
  const userJson = await response.json();

  userJson.backup_codes_verified = true;
  await fetch(USER_PATH, {
    headers,
    method: "PUT",
    body: JSON.stringify(userJson),
  });
};

export const setCorrectAgreement = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };

  await fetch(USER_TOS_PATH, {
    headers,
    method: "PUT",
    body: JSON.stringify({
      latest_accepted_tos_ipfs: CURRENT_AGREEMENT,
    }),
  });
};

const PENDING_TRANSACTIONS_PATH = "/api/user/pending_transactions/me";

export const addPendingTransactions = (
  tx: TxPendingWithMetadata,
): Cypress.Chainable<ReadonlyArray<{ transaction_type: string }>> =>
  cy
    .request({
      url: PENDING_TRANSACTIONS_PATH,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${JSON.parse(localStorage.getItem(JWT_KEY)!)}`,
      },
      body: {
        transaction: tx.transaction,
        transaction_type: tx.transactionType,
        transaction_additional_data: tx.transactionAdditionalData,
        transaction_timestamp: tx.transactionTimestamp,
        transaction_status: tx.transactionStatus,
        transaction_error: tx.transactionError,
      },
    })
    .then(response => response.body);

export const clearPendingTransactions = () =>
  cy
    .request({
      url: PENDING_TRANSACTIONS_PATH,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${JSON.parse(localStorage.getItem(JWT_KEY)!)}`,
      },
    })
    .then(async response => {
      const pendingTransactions = response.body;
      await pendingTransactions.map((TxWithMetadataSchema: TxWithMetadata) =>
        cy.request({
          url: `${PENDING_TRANSACTIONS_PATH}/${TxWithMetadataSchema.transaction.hash}`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${JSON.parse(localStorage.getItem(JWT_KEY)!)}`,
          },
        }),
      );
    });

export const getPendingTransactions = (): Cypress.Chainable<
  ReadonlyArray<{ transaction_type: string }>
> =>
  cy
    .request({
      url: PENDING_TRANSACTIONS_PATH,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${JSON.parse(localStorage.getItem(JWT_KEY)!)}`,
      },
    })
    .then(response => response.body);

export const makeAuthenticatedCall = async (path: string, config: RequestInit) =>
  await fetch(path, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "application/json",
      authorization: `Bearer ${JSON.parse(localStorage.getItem(JWT_KEY)!)}`,
    },
  });

export const logout = () => {
  cy.log("logging out");
  cy.get(tid("Header-logout")).awaitedClick();
  cy.wait(2000);
};

export const createVaultApi = async (
  salt: string,
  password: string,
  serializedVault: string,
): Promise<any> => {
  const vaultKey = await getVaultKey(salt, password);

  const path = `${VAULT_API_ROOT}/vault/${vaultKey}`;
  const payload = { wallet: serializedVault };
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });
};

const ETOS_PATH = "/api/eto-listing/etos";

export interface IHttpPartialResponse<T> {
  body: T;
}

export const getEto = (etoID: string): Cypress.Chainable<TEtoSpecsData> => {
  if (!etoID)
    throw new Error("Cannot fetch undefined value please check if the fixtures are in sync");
  return cy
    .request({ url: ETOS_PATH, method: "GET" })
    .then(
      (etos: IHttpPartialResponse<TEtoSpecsData>) =>
        etos.body && toCamelCase(etos.body).filter((eto: TEtoSpecsData) => eto.etoId === etoID)[0],
    );
};
