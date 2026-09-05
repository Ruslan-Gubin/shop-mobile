export type CatalogFiltersResponse = {
  price: { min: number; max: number };
  specifications: { id: number; name: string; type: string; values: string[] }[];
  countries: string[];
  product_types: string[];
};

export type CatalogFilter = {
  sort: string;
  price_from: string;
  price_to: string;
  specifications: string[];
  country: string[];
  product_types: string[];
};
