export const formatterRub = new Intl.NumberFormat("ru", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
  notation: "standard",
});

const dateFormatter = (options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat("ru", options);
};

export const formatDateRu = (
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!date) return "—";
  return dateFormatter(options).format(new Date(date));
};

export const formatDateLong = (
  date: string | Date | null | undefined,
  initOptions?: Intl.DateTimeFormatOptions,
) => {
  let formatDate = "";
  const currentDate = date ? new Date(date) : null;

  if (currentDate) {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };

    const isCurrentYear = currentDate.getFullYear() === new Date().getFullYear();

    if (!isCurrentYear) {
      options.year = "numeric";
    }

    if (initOptions) {
      Object.assign(options, initOptions);
    }

    formatDate = formatDateRu(date, options);
  }

  return formatDate;
};
