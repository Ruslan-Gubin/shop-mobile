import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { CONFIG_APP } from "../config/config";

const tokensStorage = createAsyncStorage(CONFIG_APP.TOKENS_STORAGE_NAME);

export const saveTokens = (token: string, refresh: string) =>
  tokensStorage
    .setMany({
      [CONFIG_APP.ACCESS_TOKEN_COOKIE]: token,
      [CONFIG_APP.REFRESH_TOKEN_COOKIE]: refresh,
    })
    .then(() => "Токены успешно сохранены")
    .catch((error) => `Не удалось сохранить токены: ${error.message}`);

export const getTokens = () =>
  tokensStorage
    .getMany([CONFIG_APP.ACCESS_TOKEN_COOKIE, CONFIG_APP.REFRESH_TOKEN_COOKIE])
    .then((tokens) => ({
      token: tokens[CONFIG_APP.ACCESS_TOKEN_COOKIE] || "",
      refresh: tokens[CONFIG_APP.REFRESH_TOKEN_COOKIE] || "",
    }))
    .catch(() => ({ token: "", refresh: "" }));

export const clearTokens = () =>
  tokensStorage.removeMany([CONFIG_APP.ACCESS_TOKEN_COOKIE, CONFIG_APP.REFRESH_TOKEN_COOKIE]);
