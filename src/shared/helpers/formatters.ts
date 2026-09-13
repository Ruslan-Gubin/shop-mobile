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

export const formatDeliveryDate = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  const dateObj = new Date(date);
  const isCurrentYear = dateObj.getFullYear() === new Date().getFullYear();

  const formattedDate = new Intl.DateTimeFormat("ru", {
    day: "2-digit",
    month: "short",
    ...(isCurrentYear ? {} : { year: "2-digit" }),
  }).format(dateObj);

  return isCurrentYear ? formattedDate : `${formattedDate}г.`;
};

export const formatDeliveryTime = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  return `${new Date(date).getHours()}:00`;
};

export const formatDeliveryInterval = (
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
): string => {
  if (!from) return "";
  return `${formatDeliveryDate(from)} с ${formatDeliveryTime(from)}${
    to ? ` до ${formatDeliveryTime(to)}` : ""
  }`;
};

export const formatDeliveryIntervalHours = (
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
): string => {
  if (!from) return "";
  return `с ${formatDeliveryTime(from)}${to ? ` до ${formatDeliveryTime(to)}` : ""}`;
};
