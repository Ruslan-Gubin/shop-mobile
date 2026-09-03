export const buildFilterParams = (
  category_id: number,
  search: string,
  price_from: string,
  price_to: string,
) => {
  const params: {
    category_id?: string;
    search?: string;
    price_from?: string;
    price_to?: string;
  } = {};

  if (category_id && !Number.isNaN(category_id)) {
    params.category_id = String(category_id);
  }

  if (typeof search === "string" && search.length > 0) {
    params.search = search;
  }

  if (
    typeof price_from === "string" &&
    price_from.length > 0 &&
    !Number.isNaN(Number(price_from))
  ) {
    params.price_from = price_from;
  }

  if (typeof price_to === "string" && price_to.length > 0 && !Number.isNaN(Number(price_to))) {
    params.price_to = price_to;
  }

  return params;
};
