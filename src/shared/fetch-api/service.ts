import type { ResponseData } from "../types/response";
import { baseFetch } from "./baseApi";

export class FetchService {
  private queue: Promise<unknown> = Promise.resolve();

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task);
    this.queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  public async get<T>(options: {
    url: string;
    params?: Record<string, string>;
    tags?: string[];
    revalidate?: false | 0 | number;
    updateToken?: { token: string; refresh: string } | null;
  }): Promise<ResponseData<T>> {
    return this.enqueue(() =>
      baseFetch({ ...options, method: "GET", updateToken: options.updateToken || null }),
    );
  }

  public post<T>({
    url,
    payload,
    params,
  }: {
    url: string;
    payload?: object | FormData;
    params?: Record<string, string>;
  }): Promise<ResponseData<T>> {
    return this.enqueue(() => baseFetch({ url, payload, method: "POST", params }));
  }

  public patch<T>({
    url,
    payload,
    params,
  }: {
    url: string;
    payload: object;
    params?: Record<string, string>;
  }): Promise<ResponseData<T>> {
    return this.enqueue(() => baseFetch({ url, payload, method: "PATCH", params }));
  }

  public put<T>({
    url,
    payload,
    params,
  }: {
    url: string;
    payload: object;
    params?: Record<string, string>;
  }): Promise<ResponseData<T>> {
    return this.enqueue(() => baseFetch({ url, payload, method: "PUT", params }));
  }

  public delete<T>({
    url,
    params,
  }: {
    url: string;
    params?: Record<string, string>;
  }): Promise<ResponseData<T>> {
    return this.enqueue(() => baseFetch({ url, method: "DELETE", params }));
  }

  public getBlob({ url }: { url: string }) {
    return this.enqueue(() => baseFetch({ method: "GET", url, isBlob: true }));
  }

  public graphQl({ query, variables }: { query: string; variables?: object }) {
    return this.enqueue(() => baseFetch({ method: "POST", payload: { query, variables } }));
  }
}

export const fetchService = new FetchService();
