import z from "zod";

export const changeProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Имя должно содержать минимум 3 символа" })
    .max(50, { message: "Максимум 50 символов" }),
  email: z.email(),
});
