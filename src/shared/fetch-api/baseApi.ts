import { fetchConfig, fetchUrl, getCurrentTokens } from "./fetch-config";
import { fetchRefreshToken } from "./utils";

interface BaseFetchArgs {
  params?: Record<string, string>;
  url?: string;
  method: string;
  payload?: object;
  isBlob?: boolean;
  updateToken?: { token: string; refresh: string } | null;
}

export const baseFetch = async (args: BaseFetchArgs) => {
  const { method, url, params, payload, isBlob, updateToken } = args;

  const isLogout = url === "auth/logout";

  const storageTokens = await getCurrentTokens(updateToken);

  const signal = new AbortController();
  const _config = fetchConfig(
    method,
    isLogout ? storageTokens.refresh : storageTokens.token,
    payload,
  );
  _config.signal = signal.signal;
  const _url = fetchUrl(url, params);

  let response = await fetch(_url, _config);
  let tokens = updateToken || null;

  if (response.status === 401 && !updateToken) {
    await fetchRefreshToken(storageTokens.refresh)
      .then(async (newTokens) => {
        if (newTokens) {
          _config.headers.Authorization = `Bearer ${newTokens.token}`;
          response = await fetch(_url, _config);
          tokens = newTokens;
        } else {
          throw "403";
        }
      })
      .catch(() => {
        signal.abort();
        tokens = { token: "", refresh: "" };
      });
  }

  if (!response.ok) {
    let message = "";
    const errors: { key: string; message: string }[] = [];

    try {
      const json = await response.json();
      const jsonErrors = json.errors as { key: string; message: string }[];
      for (const errorItem of jsonErrors) {
        errors.push(errorItem);
      }
      message = json.message || json.error || "";
    } catch {}

    return {
      data: null,
      status: "error",
      message,
      errors,
      tokens,
    };
  }

  if (isBlob) {
    return await response.blob();
  } else {
    const json = await response.json();

    return { ...json, tokens };
  }
};
