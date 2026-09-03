import type { ProductModel } from "../../shared/types/products";

export type CatalogFiltersResponse = {
  price: { min: number; max: number };
  specifications: { id: number; name: string; type: string; values: string[] }[];
  countries: string[];
  product_types: string[];
};

export type CatalogResponse = {
  products: ProductModel[];
  totalCount: number;
  paginationPage: string;
};

export type CatalogParams = {
  limit: string;
  page: string;
  category_id?: string;
  search?: string;
  sort?: string;
  price_from?: string;
  price_to?: string;
  specifications?: string;
  country?: string;
  product_types?: string;
};

export type FilterParams = {
  category_id?: string;
  search?: string;
  price_from?: string;
  price_to?: string;
};
