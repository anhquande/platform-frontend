import { inject, injectable } from "inversify";
import * as Yup from "yup";

import { symbols } from "../../di/symbols";
import { EthereumAddressWithChecksum } from "../../types";
import { SignerType } from "../web3/PersonalWeb3";
import { IHttpClient, IHttpResponse } from "./client/IHttpClient";

export interface IChallengeEndpointResponse {
  challenge: string;
}

export interface ICreateJwtEndpointResponse {
  jwt: string;
}

const SIGNATURE_BASE_URL = "/api/signature/";

@injectable()
export class SignatureAuthApi {
  constructor(
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.authorizedJsonHttpClient) private authorizedHttpClient: IHttpClient,
  ) {}

  public async challenge(
    address: EthereumAddressWithChecksum,
    salt: string,
    signerType: SignerType,
    permissions: Array<string> = [],
  ): Promise<IHttpResponse<IChallengeEndpointResponse>> {
    return await this.httpClient.post<IChallengeEndpointResponse>({
      baseUrl: SIGNATURE_BASE_URL,
      url: "/jwt/challenge",
      responseSchema: Yup.object().shape({
        challenge: Yup.string().required(),
      }),
      body: {
        address,
        salt,
        signer_type: signerType,
        permissions,
      },
    });
  }

  public createJwt(
    challenge: string,
    signedChallenge: string,
    signerType: SignerType,
  ): Promise<ICreateJwtEndpointResponse> {
    return this.httpClient
      .post<ICreateJwtEndpointResponse>({
        baseUrl: SIGNATURE_BASE_URL,
        url: "/jwt/create",
        responseSchema: Yup.object().shape({
          jwt: Yup.string().required(),
        }),
        body: {
          challenge,
          response: signedChallenge,
          signer_type: signerType,
        },
      })
      .then(r => r.body);
  }

  public escalateJwt(
    challenge: string,
    signedChallenge: string,
    signerType: SignerType,
  ): Promise<ICreateJwtEndpointResponse> {
    return this.authorizedHttpClient
      .post<ICreateJwtEndpointResponse>({
        baseUrl: SIGNATURE_BASE_URL,
        url: "/jwt/create",
        responseSchema: Yup.object().shape({
          jwt: Yup.string().required(),
        }),
        body: {
          challenge,
          response: signedChallenge,
          signer_type: signerType,
        },
      })
      .then(r => r.body);
  }

  public refreshJwt(): Promise<ICreateJwtEndpointResponse> {
    return this.authorizedHttpClient
      .post<ICreateJwtEndpointResponse>({
        baseUrl: SIGNATURE_BASE_URL,
        url: "/jwt/refresh",
        responseSchema: Yup.object().shape({
          jwt: Yup.string().required(),
        }),
      })
      .then(r => r.body);
  }
}
