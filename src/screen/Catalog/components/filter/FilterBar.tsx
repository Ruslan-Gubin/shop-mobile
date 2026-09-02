import { ScrollView, StyleSheet, View } from "react-native";
import type { CatalogFiltersResponse } from "../../../../shared/types/catalog";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { PriceFilter } from "./PriceFilter";
import { SortFilter } from "./SortFilter";

export const INIT_FILTERS: CatalogFilterState = {
  sort: "popular",
  priceFrom: "",
  priceTo: "",
  specifications: [],
  country: [],
  productTypes: [],
};

export const buildFilterParams = (
  categoryId: number | undefined,
  search: string | undefined,
  state: CatalogFilterState,
) => {
  const params: {
    category_id?: string;
    search?: string;
    price_from?: string;
    price_to?: string;
  } = {};
  if (categoryId) params.category_id = String(categoryId);
  if (search) params.search = search;
  if (state.priceFrom) params.price_from = state.priceFrom;
  if (state.priceTo) params.price_to = state.priceTo;
  return params;
};

export type CatalogFilterState = {
  sort: string;
  priceFrom: string;
  priceTo: string;
  specifications: string[];
  country: string[];
  productTypes: string[];
};

type Props = {
  filters: CatalogFiltersResponse | null;
  state: CatalogFilterState;
  onSortChange: (value: string) => void;
  onPriceChange: (value: { from: string; to: string }) => void;
  onPriceReset: () => void;
  onSpecificationToggle: (value: string) => void;
  onSpecificationReset: (values: string[]) => void;
  onCountryToggle: (value: string) => void;
  onCountryReset: () => void;
  onProductTypeToggle: (value: string) => void;
  onProductTypeReset: () => void;
};

const SORT_OPTIONS = [
  { value: "popular", label: "По популярности" },
  { value: "rate", label: "По рейтингу" },
  { value: "price_up", label: "По возрастанию цены" },
  { value: "price_down", label: "По убыванию цены" },
  { value: "new", label: "По новинкам" },
];

export const FilterBar = (props: Props) => {
  const minPrice = props.filters?.price?.min || 1;
  const maxPrice = props.filters?.price?.max || 100000;

  const priceActive =
    props.state.priceFrom !== "" || props.state.priceTo !== "";

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SortFilter value={props.state.sort || "popular"} onChange={props.onSortChange} options={SORT_OPTIONS} />

        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          value={{ from: props.state.priceFrom, to: props.state.priceTo }}
          onChange={props.onPriceChange}
          onReset={props.onPriceReset}
          active={priceActive}
        />

        {props.filters?.specifications.map((specification) => {
          const selected = props.state.specifications.filter((el) =>
            el.startsWith(`${specification.id}:`),
          );
          return (
            <MultiSelectFilter
              key={specification.id}
              title={specification.name}
              values={specification.values}
              selected={selected}
              onChange={(key) => props.onSpecificationToggle(`${specification.id}:${key}`)}
              onReset={() =>
                props.onSpecificationReset(
                  specification.values.map((value) => `${specification.id}:${value}`),
                )
              }
            />
          );
        })}

        {props.filters?.countries && props.filters.countries.length > 0 && (
          <MultiSelectFilter
            title="Производитель"
            values={props.filters.countries}
            selected={props.state.country}
            onChange={props.onCountryToggle}
            onReset={props.onCountryReset}
          />
        )}

        {props.filters?.product_types && props.filters.product_types.length > 0 && (
          <MultiSelectFilter
            title="Вид товара"
            values={props.filters.product_types}
            selected={props.state.productTypes}
            onChange={props.onProductTypeToggle}
            onReset={props.onProductTypeReset}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: 12,
    columnGap: 8,
    alignItems: "center",
  },
});
