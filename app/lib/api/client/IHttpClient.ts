import * as Yup from "yup";
import { Dictionary } from "../../../types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IHttpRequestCommon {
  url: string;
  baseUrl?: string;
  responseSchema?: Yup.Schema;
  headers?: Dictionary<string>;
  body?: any;
  formData?: FormData;
  expectsNoResponse?: boolean;
  allowedStatusCodes?: number[]; // 20x are always allowed
}

export interface IHttpGetRequest extends IHttpRequestCommon {
  queryParams?: Dictionary<string>;
}

export interface IHttpClientErrorDocument {
  status: number; // http status goes here
  title: string; // human readable string goes here
  type: string; // type of the error
  instance: string; // url that was hit goes here
  // @todo add space for failed validation here
}

export interface IHttpPostRequest extends IHttpRequestCommon {}
export interface IHttpPutRequest extends IHttpRequestCommon {}
export interface IHttpPatchRequest extends IHttpRequestCommon {}
export interface IHttpDeleteRequest extends IHttpRequestCommon {}

export interface IHttpResponse<T> {
  body: T;
  statusCode: number;
}

export interface IHttpClient {
  get<T>(config: IHttpGetRequest): Promise<IHttpResponse<T>>;
  post<T>(config: IHttpPostRequest): Promise<IHttpResponse<T>>;
  put<T>(config: IHttpPutRequest): Promise<IHttpResponse<T>>;
  patch<T>(config: IHttpPatchRequest): Promise<IHttpResponse<T>>;
  delete<T>(config: IHttpDeleteRequest): Promise<IHttpResponse<T>>;
}
