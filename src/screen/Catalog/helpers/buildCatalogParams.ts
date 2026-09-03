import type { CatalogFilterState } from "../types";

export const buildCatalogParams = (
  page: string,
  limit: string,
  category_id: number,
  search: string,
  filter: CatalogFilterState,
) => {
  const params: {
    limit: string;
    category_id?: string;
    search?: string;
    page: string;
    price_from?: string;
    price_to?: string;
    sort?: string;
    specifications?: string;
    country?: string;
    product_types?: string;
  } = {
    page: page || "1",
    limit,
    sort: filter.sort || "popular",
  };

  if (category_id && !Number.isNaN(category_id)) {
    params.category_id = String(category_id);
  }

  if (typeof search === "string" && search.length > 0) {
    params.search = search;
  }

  if (
    filter.priceFrom &&
    typeof filter.priceFrom === "string" &&
    filter.priceFrom.length > 0 &&
    !Number.isNaN(Number(filter.priceFrom))
  ) {
    params.price_from = filter.priceFrom;
  }

  if (
    typeof filter.priceTo === "string" &&
    filter.priceTo.length > 0 &&
    !Number.isNaN(Number(filter.priceTo))
  ) {
    params.price_to = filter.priceTo;
  }

  if (filter.specifications.length > 0) {
    params.specifications = filter.specifications.join(",");
  }

  if (filter.country.length > 0) {
    params.country = filter.country;
  }

  if (filter.productTypes.length > 0) {
    params.product_types = filter.productTypes;
  }

  return params;
};
