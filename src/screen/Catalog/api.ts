import { fetchService } from "../../shared/fetch-api";
import type { CatalogFiltersResponse, CatalogParams, CatalogResponse, FilterParams } from "./types";

export const fetchCatalogFilters = (params: FilterParams) =>
  fetchService.get<CatalogFiltersResponse>({ url: "product/filters", params });

export const fetchCatalogProducts = (params: CatalogParams) =>
  fetchService.get<CatalogResponse>({ url: "product/catalog", params });
