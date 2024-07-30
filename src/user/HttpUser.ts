import { Async } from "../utils/asynchronism"
import { checkStatus } from "../utils/error"
import { Model } from "../utils/model"

export const CONTENT_TYPES = {
  application: {
    json: "application/json"
  }
}

const API_URL = process.env.SRV_API_URL || "http://localhost:8000";

export type HttpClient = {

  get: <T>(url: string, resultType: Model<T>) => Async<T>
  post: <T>(url: string, body: FormData | unknown, resultType: Model<T>) => Async<T>
  patch: <T>(url: string, body: FormData | unknown, resultType: Model<T>) => Async<T>
  delete: <T>(url: string, resultType: Model<T>) => Async<T>
}

export const httpRequest = <T>(
  args: { 
    method: "GET" | "POST" | "DELETE" | "PATCH",
    url: string,
    contentType?: string,
    authToken?: string,
    body?: FormData | string,
    resultType: Model<T>
  }
): Async<T> =>
  async () => {

    const response = await window.fetch(
      args.url,
      {
        method: args.method,
        mode: "cors",
        headers: args.authToken === undefined ? {
          'content-type':  args.contentType || 'application/json;charset=UTF-8',
        } :
        {
          'content-type': args.contentType || 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${args.authToken}`,
        },
        body: args.body
      }
    )
    
    checkStatus(response.status)
    
    return await response.json()

  }

export const httpUser = (authToken?: string): HttpClient => ({

  get: (url, resultType) =>
    httpRequest({
      method: "GET",
      url: `${API_URL}${url}`,
      authToken: authToken,
      resultType: resultType,
    }),

  post: (url, body, resultType) =>
    httpRequest({
      method: "POST",
      url: `${API_URL}${url}`,
      authToken: authToken,
      contentType: body instanceof FormData ? undefined : CONTENT_TYPES.application.json,
      body: body instanceof FormData ? body : JSON.stringify(body),
      resultType: resultType,
    }),

  patch: (url, body, resultType) =>
    httpRequest({
      method: "PATCH",
      url: `${API_URL}${url}`,
      authToken: authToken,
      contentType: body instanceof FormData ? undefined : CONTENT_TYPES.application.json,
      body: body instanceof FormData ? body : JSON.stringify(body),
      resultType: resultType,
    }),

  delete: (url, resultType) =>
    httpRequest({
      method: "DELETE",
      url: `${API_URL}${url}`,
      authToken: authToken,
      resultType: resultType,
    }),
})
