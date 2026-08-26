import { z } from "zod";

export const ErrorItemSchema = z.object({
  key: z.string(),
  message: z.string(),
});

export type ErrorItem = z.infer<typeof ErrorItemSchema>;

const TokensSchema = z
  .object({
    token: z.string(),
    refresh: z.string(),
  })
  .nullable();

export function createResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema.nullable(),
    status: z.enum(["success", "error"]),
    message: z.string(),
    errors: z.array(ErrorItemSchema),
    tokens: TokensSchema,
  });
}

export interface ResponseData<T> {
  data: T | null;
  status: "success" | "error";
  message: string;
  errors: ErrorItem[];
  tokens: { token: string; refresh: string } | null;
}
