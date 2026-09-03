import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import type { SearchModel } from "../../shared/types/search";
import { SearchNavigateButton } from "../../widgets/home/search-navigate-button/SearchNavigateButton";
import { fetchCatalogFilters } from "./api";
import {
  buildFilterParams,
  type CatalogFilterState,
  FilterBar,
  INIT_FILTERS,
} from "./components/filter/FilterBar";
import { ProductsView } from "./components/ProductsView";
import { SimilarSearch } from "./components/SimilarSearch";
import type { CatalogFiltersResponse } from "./types";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Catalog">;
  route?: {
    key: string;
    name: string;
    params: { search?: string; category: number };
  };
};

export const CatalogScreen = (props: Props) => {
  const search = props.route?.params?.search || "";
  const hasSearch = search.length > 0;
  const categoryId = props.route?.params?.category || 0;
  const hasCategory = categoryId > 0;

  const [similarSearch, setSimilarSearch] = useState<SearchModel[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterState, setFilterState] = useState<CatalogFilterState>(INIT_FILTERS);
  const [filtersData, setFiltersData] = useState<CatalogFiltersResponse | null>(null);
  console.log("filtersData:", filtersData);

  const fetchSimilarSearchEvent = useEffectEvent((text: string) => {
    fetchService
      .get<SearchModel[]>({
        url: "search",
        params: { text, limit: "7" },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setSimilarSearch(response.data);
        }
      });
  });

  // useEffect(() => {
  //   if (hasSearch) {
  //     fetchSimilarSearchEvent(search);
  //   } else {
  //     setSimilarSearch([]);
  //   }
  // }, [hasSearch, search]);

  const fetchFiltersEvent = useEffectEvent((categoryId: number | undefined, text: string) => {
    setFilterState(INIT_FILTERS);
    setFiltersData(null);
    fetchCatalogFilters(buildFilterParams(categoryId, text, INIT_FILTERS)).then((response) => {
      if (response.status === "success" && response.data) {
        setFiltersData(response.data);
      }
    });
  });

  // useEffect(() => {
  //   const categoryId =
  //     !hasSearch && selectedCategory && childrenCategories.length === 0
  //       ? selectedCategory.id
  //       : undefined;
  //   fetchFiltersEvent(categoryId, hasSearch ? search : undefined);
  // }, [hasSearch, search, categoryId]);

  const handleSortChange = (value: string) => setFilterState((prev) => ({ ...prev, sort: value }));

  const handlePriceChange = (value: { from: string; to: string }) =>
    setFilterState((prev) => ({ ...prev, priceFrom: value.from, priceTo: value.to }));

  const handlePriceReset = () =>
    setFilterState((prev) => ({ ...prev, priceFrom: "", priceTo: "" }));

  const handleSpecificationToggle = (key: string) =>
    setFilterState((prev) => {
      const current = prev.specifications.includes(key)
        ? prev.specifications.filter((el) => el !== key)
        : [...prev.specifications, key];
      return { ...prev, specifications: current };
    });

  const handleSpecificationReset = (values: string[]) =>
    setFilterState((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((el) => !values.includes(el)),
    }));

  const handleCountryToggle = (value: string) =>
    setFilterState((prev) => {
      const current = prev.country.includes(value)
        ? prev.country.filter((el) => el !== value)
        : [...prev.country, value];
      return { ...prev, country: current };
    });

  const handleCountryReset = () => setFilterState((prev) => ({ ...prev, country: [] }));

  const handleProductTypeToggle = (value: string) =>
    setFilterState((prev) => {
      const current = prev.productTypes.includes(value)
        ? prev.productTypes.filter((el) => el !== value)
        : [...prev.productTypes, value];
      return { ...prev, productTypes: current };
    });

  const handleProductTypeReset = () => setFilterState((prev) => ({ ...prev, productTypes: [] }));

  return (
    <View style={styles.root}>
      {hasSearch && <SearchNavigateButton onPress={() => props.navigation?.push("Search")} />}

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#a73afd" />
        </View>
      )}

      {hasSearch && similarSearch.length > 0 && (
        <SimilarSearch
          similarSearch={similarSearch}
          onSelect={(text) => props.navigation?.push("Catalog", { search: text })}
          count={count}
          search={search}
        />
      )}

      <FilterBar
        filters={filtersData}
        state={filterState}
        onSortChange={handleSortChange}
        onPriceChange={handlePriceChange}
        onPriceReset={handlePriceReset}
        onSpecificationToggle={handleSpecificationToggle}
        onSpecificationReset={handleSpecificationReset}
        onCountryToggle={handleCountryToggle}
        onCountryReset={handleCountryReset}
        onProductTypeToggle={handleProductTypeToggle}
        onProductTypeReset={handleProductTypeReset}
      />

      <ProductsView
        key={`search_${search}`}
        search={search}
        filterState={filterState}
        navigation={props.navigation}
        onCountChange={setCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  menuList: {
    flex: 1,
  },
  contentWithSearchButton: {
    paddingTop: 56,
  },
  searchHeader: {
    paddingTop: 56,
    rowGap: 8,
  },
  searchLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#242424",
    flexShrink: 1,
  },
  searchCount: {
    fontSize: 13,
    color: "#868695",
    flexShrink: 1,
  },
});
