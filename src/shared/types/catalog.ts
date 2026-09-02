import type { CategoryModel } from "./category";
import type { ProductModel } from "./products";

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

export type CategoryPathResponse = {
  categories: CategoryModel[];
  childrenCategories: CategoryModel[];
  transitionCategories: CategoryModel[];
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
