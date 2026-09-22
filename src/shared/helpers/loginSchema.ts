import { z } from "zod";
import { isRfDefCode, normalizePhone } from "./phoneValidation";

export const loginCodeSchema = z
  .string()
  .min(6, { message: "Код должен состоять минимум из 6 цифр" })
  .regex(/^\d{6}$/, { message: "Неверно введен код" });

export const loginEmailSchema = z.email({ message: "Некорректный email" });

export const loginPasswordSchema = z
  .string()
  .min(6, { message: "Пароль должен содержать минимум 6 символов" });

export const phoneSchema = z
  .string()
  .min(11, { message: "Введите номер телефона" })
  .max(11, { message: "Максимум 11 символов" })
  .transform((val) => normalizePhone(val))
  .refine((val) => val !== null, {
    message: "Некорректный формат номера телефона",
  })
  .refine(
    (val) => {
      if (!val) return false;
      return isRfDefCode(val);
    },
    {
      message: "Номер не принадлежит мобильному оператору РФ",
    },
  )
  .transform((val) => val as string);
