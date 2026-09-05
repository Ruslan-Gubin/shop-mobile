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
import type { CatalogFilter, CatalogFiltersResponse } from "./types";

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
  const hasCategory = category_id > 0;
  const category_name = props.route?.params?.category_name || "";

  const [similarSearch, setSimilarSearch] = useState<SearchModel[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<CatalogFilter>({
    sort: "popular",
    price_from: "",
    price_to: "",
    specifications: [],
    country: [],
    product_types: [],
  });

  const [filtersData, setFiltersData] = useState<CatalogFiltersResponse>({
    countries: [],
    price: { min: 0, max: 0 },
    product_types: [],
    specifications: [],
  });

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
    const params = buildFilterParams(category_id, search, "", "");

    fetchService
      .get<CatalogFiltersResponse>({ url: "product/filters", params })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setFiltersData(response.data);

          if (
            Object.hasOwn(response.data, "price") &&
            !Number.isNaN(response.data.price.min) &&
            typeof response.data.price.min === "number" &&
            !Number.isNaN(response.data.price.max) &&
            typeof response.data.price.max === "number" &&
            response.data.price.min !== response.data.price.max
          ) {
            const price_from = String(response.data.price.min) || "";
            const price_to = String(response.data.price.max) || "";

            setFilters((prev) => ({ ...prev, price_from, price_to }));
          }
        }
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    fetchFiltersEvent();
    fetchSimilarSearchEvent();
  }, []);

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

      {!loading && (
        <FilterBar filters={filters} setFilters={setFilters} filtersData={filtersData} />
      )}

      {!loading && (
        <ProductsView
          search={search}
          filters={filters}
          navigation={props.navigation}
          onCountChange={setCount}
          category_id={category_id}
        />
      )}
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
