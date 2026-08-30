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