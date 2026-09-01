import { z } from "zod";

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

export const createOrderSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Телефон получателя должен состоять минимум из 10 цифр" })
    .regex(/^\d{10,15}$/, { message: "Некорректный формат номера телефона" })
    .or(z.literal("")),
  phoneCode: z.string().or(z.literal("")),
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
