export type CatalogFiltersResponse = {
  price: { min: number; max: number };
  specifications: { id: number; name: string; type: string; values: string[] }[];
  countries: string[];
  product_types: string[];
};

export type FilterParams = {
  category_id?: string;
  search?: string;
  price_from?: string;
  price_to?: string;
};

export type CatalogFilterState = {
  sort: string;
  priceFrom: string;
  priceTo: string;
  specifications: string[];
  country: string;
  productTypes: string;
};
