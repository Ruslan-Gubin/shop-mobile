import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import type { SearchModel } from "../../shared/types/search";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { SearchNavigateButton } from "../../widgets/home/search-navigate-button/SearchNavigateButton";
import { FilterBar } from "./components/filter/FilterBar";
import { ProductsView } from "./components/ProductsView";
import { SimilarSearch } from "./components/SimilarSearch";
import { buildFilterParams } from "./helpers/buildFilterParams";
import type { CatalogFilterState, CatalogFiltersResponse } from "./types";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Catalog">;
  route?: {
    key: string;
    name: string;
    params: { search?: string; category_id: number; category_name: string };
  };
};

export const CatalogScreen = (props: Props) => {
  const search = props.route?.params?.search || "";
  const hasSearch = search.length > 0;
  const category_id = props.route?.params?.category_id || 0;
  const category_name = props.route?.params?.category_name || "";
  const hasCategory = category_id > 0;

  const [similarSearch, setSimilarSearch] = useState<SearchModel[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterState, setFilterState] = useState<CatalogFilterState>({
    sort: "popular",
    priceFrom: "",
    priceTo: "",
    specifications: [],
    country: "",
    productTypes: "",
  });
  const [filtersData, setFiltersData] = useState<CatalogFiltersResponse | null>(null);

  const fetchSimilarSearchEvent = useEffectEvent(() => {
    if (search.trim().length > 0) {
      fetchService
        .get<SearchModel[]>({
          url: "search",
          params: { text: search, limit: "7" },
        })
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setSimilarSearch(response.data);
          }
        });
    }
  });

  const fetchFiltersEvent = useEffectEvent(() => {
    const params = buildFilterParams(
      category_id,
      search,
      filterState.priceFrom,
      filterState.priceTo,
    );

    fetchService
      .get<CatalogFiltersResponse>({ url: "product/filters", params })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setFiltersData(response.data);
        }
      });
  });

  useEffect(() => {
    fetchFiltersEvent();
    fetchSimilarSearchEvent();
  }, []);

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
      {hasSearch && (
        <SearchNavigateButton
          variant="gray"
          title={search}
          onPress={() => props.navigation?.push("Search")}
        />
      )}

      {!hasSearch && hasCategory && category_name.length > 0 && (
        <PageHeader title={category_name} onBack={() => props?.navigation?.goBack()} />
      )}

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#a73afd" />
        </View>
      )}

      <SimilarSearch
        similarSearch={similarSearch}
        onSelect={(text) => props.navigation?.push("Catalog", { search: text })}
        count={count}
        search={search}
      />

      {filtersData !== null && (
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
      )}

      <ProductsView
        search={search}
        filter={filterState}
        navigation={props.navigation}
        onCountChange={setCount}
        category_id={category_id}
        title="11 товаров"
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
});
