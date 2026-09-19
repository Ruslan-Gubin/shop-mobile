import { z } from "zod";

export const loginCodeSchema = z
  .string()
  .min(6, { message: "Код должен состоять минимум из 6 цифр" })
  .regex(/^\d{6}$/, { message: "Неверно введен код" });

export const loginEmailSchema = z.email({ message: "Некорректный email" });

export const loginPasswordSchema = z
  .string()
  .min(6, { message: "Пароль должен содержать минимум 6 символов" });

const RF_DEF_CODES = [
  "949",
  "979",
  "900",
  "901",
  "902",
  "903",
  "904",
  "905",
  "906",
  "908",
  "909",
  "910",
  "911",
  "912",
  "913",
  "914",
  "915",
  "916",
  "917",
  "918",
  "919",
  "920",
  "921",
  "922",
  "923",
  "924",
  "925",
  "926",
  "927",
  "928",
  "929",
  "930",
  "931",
  "932",
  "933",
  "934",
  "936",
  "937",
  "938",
  "939",
  "950",
  "951",
  "952",
  "953",
  "954",
  "955",
  "956",
  "957",
  "958",
  "960",
  "961",
  "962",
  "963",
  "964",
  "965",
  "966",
  "967",
  "968",
  "969",
  "970",
  "971",
  "980",
  "981",
  "982",
  "983",
  "984",
  "985",
  "986",
  "987",
  "988",
  "989",
  "991",
  "992",
  "993",
  "994",
  "995",
  "996",
  "997",
  "998",
  "999",
];

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  return /^7\d{10}$/.test(digits) ? digits : null;
}

export const phoneSchema = z
  .string()
  .min(1, { message: "Введите номер телефона" })
  .transform((val) => normalizePhone(val))
  .refine((val) => val !== null, {
    message: "Некорректный формат номера телефона",
  })
  .refine(
    (val) => {
      if (!val) return false;
      const def = val.slice(1, 4);
      return RF_DEF_CODES.includes(def);
    },
    {
      message: "Номер не принадлежит мобильному оператору РФ",
    },
  )
  .transform((val) => val as string);
