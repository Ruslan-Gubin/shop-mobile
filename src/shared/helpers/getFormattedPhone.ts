export const getFormattedPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  let updatePhone = value;

  if (digits.length > 3) {
    updatePhone = `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }

  if (digits.length > 6) {
    updatePhone = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  if (digits.length > 8) {
    updatePhone = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }

  return updatePhone;
};

export const getPhoneDisplay = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  return `${digits.at(0) === "7" || digits.at(0) === "8" ? "+" : ""}${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
};
