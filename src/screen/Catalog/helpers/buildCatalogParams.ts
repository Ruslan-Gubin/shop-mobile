import type { CatalogFilter } from "../types";
import { getSpecificationParams } from "./getSpecificationParams";

export const buildCatalogParams = (
  page: string,
  limit: string,
  category_id: number,
  search: string,
  filter: CatalogFilter,
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
    filter.price_from &&
    typeof filter.price_from === "string" &&
    filter.price_from.length > 0 &&
    !Number.isNaN(Number(filter.price_from))
  ) {
    params.price_from = filter.price_from;
  }

  if (
    typeof filter.price_to === "string" &&
    filter.price_to.length > 0 &&
    !Number.isNaN(Number(filter.price_to))
  ) {
    params.price_to = filter.price_to;
  }

  if (filter.specifications.length > 0) {
    params.specifications = getSpecificationParams(filter.specifications).join(",");
  }

  if (filter.country.length > 0) {
    params.country = filter.country.join(",");
  }

  if (filter.product_types.length > 0) {
    params.product_types = filter.product_types.join(",");
  }

  return params;
};
