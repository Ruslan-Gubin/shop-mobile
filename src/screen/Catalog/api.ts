import { fetchService } from "../../shared/fetch-api";
import type {
  CatalogFiltersResponse,
  CatalogParams,
  CatalogResponse,
  CategoryPathResponse,
  FilterParams,
} from "../../shared/types/catalog";
import type { CategoryModel } from "../../shared/types/category";
import type { SearchModel } from "../../shared/types/search";

export const fetchCategories = () =>
  fetchService.get<CategoryModel[]>({ url: "category/categories" });

export const fetchCategoryPath = (categoryId: number | undefined) =>
  fetchService.get<CategoryPathResponse>({
    url: `category/fullPathCategories/${categoryId ?? ""}`,
  });

export const fetchSimilarSearch = (text: string) =>
  fetchService.get<SearchModel[]>({
    url: "search",
    params: { text, limit: "7" },
  });

export const fetchCatalogFilters = (params: FilterParams) =>
  fetchService.get<CatalogFiltersResponse>({ url: "product/filters", params });

export const fetchCatalogProducts = (params: CatalogParams) =>
  fetchService.get<CatalogResponse>({ url: "product/catalog", params });
