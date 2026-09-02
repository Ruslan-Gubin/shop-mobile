import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { declOfNum } from "../../shared/helpers/declOfNum";
import type { CategoryModel } from "../../shared/types/category";
import type { CatalogFiltersResponse } from "../../shared/types/catalog";
import type { SearchModel } from "../../shared/types/search";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { SearchNavigateButton } from "../../widgets/home/search-navigate-button/SearchNavigateButton";
import { ProductRecent } from "../../widgets/product/product-recent/ProductRecent";
import { fetchCategories, fetchCategoryPath, fetchCatalogFilters, fetchSimilarSearch } from "./api";
import { CategoryList } from "./components/CategoryList";
import { ProductsView } from "./components/ProductsView";
import { SimilarSearch } from "./components/SimilarSearch";
import {
  buildFilterParams,
  FilterBar,
  INIT_FILTERS,
  type CatalogFilterState,
} from "./components/filter/FilterBar";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Catalog">;
  route?: {
    key: string;
    name: string;
    params?: { search?: string };
  };
};

export const CatalogScreen = (props: Props) => {
  const search = props.route?.params?.search || "";

  const [selectedCategory, setSelectedCategory] = useState<CategoryModel | null>(null);
  const [mainCategories, setMainCategories] = useState<CategoryModel[]>([]);
  const [childrenCategories, setChildrenCategories] = useState<CategoryModel[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [similarSearch, setSimilarSearch] = useState<SearchModel[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterState, setFilterState] = useState<CatalogFilterState>(INIT_FILTERS);
  const [filtersData, setFiltersData] = useState<CatalogFiltersResponse | null>(null);

  const hasSearch = search.length > 0;

  const fetchMainCategoriesEvent = useEffectEvent(() => {
    setLoading(true);
    fetchCategories()
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setMainCategories(response.data.filter((el) => el.parent_id === null));
        }
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    if (!hasSearch && !selectedCategory) {
      fetchMainCategoriesEvent();
    }
  }, [hasSearch, selectedCategory]);

  const fetchCategoryPathEvent = useEffectEvent((category: CategoryModel) => {
    setLoading(true);
    setChildrenCategories([]);
    fetchCategoryPath(category.id)
      .then((response) => {
        if (response.status === "success" && response.data) {
          setChildrenCategories(response.data.childrenCategories || []);
          setCategoryName(category.name);
        }
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    if (hasSearch || !selectedCategory) return;
    fetchCategoryPathEvent(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSearch, selectedCategory?.id]);

  const fetchSimilarSearchEvent = useEffectEvent((text: string) => {
    fetchSimilarSearch(text).then((response) => {
      if (response.status === "success" && Array.isArray(response.data)) {
        setSimilarSearch(response.data);
      }
    });
  });

  useEffect(() => {
    if (hasSearch) {
      fetchSimilarSearchEvent(search);
    } else {
      setSimilarSearch([]);
    }
  }, [hasSearch, search]);

  const fetchFiltersEvent = useEffectEvent((categoryId: number | undefined, text: string) => {
    setFilterState(INIT_FILTERS);
    setFiltersData(null);
    fetchCatalogFilters(buildFilterParams(categoryId, text, INIT_FILTERS)).then((response) => {
      if (response.status === "success" && response.data) {
        setFiltersData(response.data);
      }
    });
  });

  useEffect(() => {
    const categoryId =
      !hasSearch && selectedCategory && childrenCategories.length === 0
        ? selectedCategory.id
        : undefined;
    fetchFiltersEvent(categoryId, hasSearch ? search : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSearch, search, selectedCategory?.id]);

  const handleSelectCategory = (category: CategoryModel) => {
    setSelectedCategory(category);
  };

  const handleBackToMenu = () => {
    setSelectedCategory(null);
  };

  const handleSortChange = (value: string) =>
    setFilterState((prev) => ({ ...prev, sort: value }));

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

  const handleProductTypeReset = () =>
    setFilterState((prev) => ({ ...prev, productTypes: [] }));

  const isLeafCategory = !hasSearch && !!selectedCategory && childrenCategories.length === 0;

  const filterBar = (
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
  );

  return (
    <View style={styles.root}>
      {hasSearch ? (
        <>
          <SearchNavigateButton onPress={() => props.navigation?.push("Search")} />
          <View style={styles.searchHeader}>
            <View style={styles.searchLine}>
              {search ? (
                <Text numberOfLines={1} style={styles.searchTitle}>
                  {search}
                </Text>
              ) : null}
              {count > 0 ? (
                <Text numberOfLines={1} style={styles.searchCount}>
                  {`Найдено ${count} ${declOfNum(count, ["товар", "товара", "товаров"])}`}
                </Text>
              ) : null}
            </View>
            <SimilarSearch
              similarSearch={similarSearch}
              onSelect={(text) => props.navigation?.push("Catalog", { search: text })}
            />
          </View>
          {filterBar}
          <ProductsView
            key={`search_${search}`}
            search={search}
            filterState={filterState}
            navigation={props.navigation}
            onCountChange={setCount}
          />
        </>
      ) : selectedCategory ? (
        <>
          <PageHeader title={categoryName || selectedCategory.name} onBack={handleBackToMenu} />
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#a73afd" />
            </View>
          ) : isLeafCategory ? (
            <>
              {filterBar}
              <ProductsView
                key={`cat_${selectedCategory.id}`}
                categoryId={selectedCategory.id}
                filterState={filterState}
                navigation={props.navigation}
              />
            </>
          ) : (
            <FlatList
              data={[]}
              style={styles.categoriesScroll}
              ListHeaderComponentStyle={styles.listHeaderComponentStyle}
              ListHeaderComponent={
                <CategoryList categories={childrenCategories} onSelect={handleSelectCategory} />
              }
              contentContainerStyle={styles.menuContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponentStyle={styles.listFooterComponentStyle}
              ListFooterComponent={
                <ProductRecent navigation={props.navigation} isHasNavigateSeeAll />
              }
            />
          )}
        </>
      ) : (
        <>
          <SearchNavigateButton onPress={() => props.navigation?.push("Search")} />
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="#a73afd" />
            </View>
          ) : (
            <FlatList
              data={[]}
              style={styles.menuList}
              ListHeaderComponentStyle={styles.listHeaderComponentStyle}
              ListHeaderComponent={
                <CategoryList categories={mainCategories} onSelect={handleSelectCategory} />
              }
              contentContainerStyle={styles.contentWithSearchButton}
              showsVerticalScrollIndicator={false}
              ListFooterComponentStyle={styles.listFooterComponentStyle}
              ListFooterComponent={
                <ProductRecent navigation={props.navigation} isHasNavigateSeeAll />
              }
            />
          )}
        </>
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
  menuList: {
    flex: 1,
  },
  categoriesScroll: {
    flex: 1,
  },
  listHeaderComponentStyle: {
    rowGap: 16,
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
  menuContent: {
    paddingBottom: 16,
  },
  listFooterComponentStyle: {
    paddingTop: 16,
  },
});
