import { z } from "zod";

export const loginPhoneSchema = z
  .string()
  .min(10, { message: "Телефон должен состоять минимум из 10 цифр" })
  .regex(/^\d{10,15}$/, { message: "Некорректный формат номера телефона" });

export const loginCodeSchema = z
  .string()
  .min(6, { message: "Код должен состоять минимум из 6 цифр" })
  .regex(/^\d{6}$/, { message: "Неверно введен код" });
