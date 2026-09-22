import { z } from "zod";
import { isRfDefCode, normalizePhone } from "./phoneValidation";

const addressSchema = z.object({
  type: z.enum(["pickup", "courier"]),
  name: z.string(),
  place: z.string(),
  lng: z.number(),
  lat: z.number(),
  entrance: z.string().or(z.literal("")),
  flat: z.string().or(z.literal("")),
  floor: z.string().or(z.literal("")),
  intercom: z.string().or(z.literal("")),
});

const productSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1, { message: "Количество должно быть минимум 1" }),
});

// Телефон опционален (может быть пустым), но если заполнен — должен быть
// 11-значным номером с ведущей 7 и кодом оператора РФ, как в логине (phoneSchema).
const optionalPhoneSchema = z
  .string()
  .refine((val) => {
    if (val === "") return true;

    const normalized = normalizePhone(val);

    return normalized !== null && isRfDefCode(normalized);
  }, {
    message: "Некорректный формат номера телефона",
  });

export const createOrderSchema = z.object({
  phone: optionalPhoneSchema,
  recipient_name: z
    .string()
    .max(50, { message: "Максимум 50 символов" })
    .min(3, { message: "Имя получателя должно содержать минимум 3 символа" })
    .or(z.literal("")),
  comment: z
    .string()
    .max(1000, { message: "Комментарий должен содержать максимум 1000 символов" })
    .or(z.literal("")),
  payment_method: z.enum(["cash", "card"]),
  method_receipt: z.enum(["pickup", "courier"]),
  date_from: z.date(),
  date_to: z.date(),
  address: addressSchema.nullable(),
  products: z.array(productSchema),
});
