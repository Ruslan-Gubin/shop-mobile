"use server";
import { z } from "zod";
import { CONFIG_APP } from "../config/config";
import { saveTokens } from "../storage/tokens";
import type { ResponseData } from "../types/response";

const RefreshTokenResponseSchema = z.object({
  token: z.string().nonempty(),
  refresh: z.string().nonempty(),
});

type RefreshTokenResponseDto = z.infer<typeof RefreshTokenResponseSchema>;

export const fetchRefreshToken = async (refresh: string) => {
  const url = `${CONFIG_APP.BACKEND_URL}auth/refresh-token`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw response.status;
      }
      return response.json();
    })
    .then(async (response: ResponseData<RefreshTokenResponseDto>) => {
      if (response.status === "success" && response.data) {
        await saveTokens(response.data.token, response.data.refresh);
        return response.data;
      }
    });
};
