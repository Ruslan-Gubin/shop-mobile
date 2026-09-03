import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { getWidthCard } from "../../../shared/helpers/getWidthCard";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../../shared/types/products";
import { NotContent } from "../../../widgets/not-content/NotContent";
import { ProductCard } from "../../../widgets/product/product-card/ProductCard";
import { ProductRecent } from "../../../widgets/product/product-recent/ProductRecent";
import { fetchCatalogProducts } from "../api";
import type { CatalogParams } from "../types";
import type { CatalogFilterState } from "./filter/FilterBar";

type Props = {
  categoryId?: number;
  search?: string;
  title?: string;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  onCountChange?: (count: number) => void;
  filterState: CatalogFilterState;
};

const LIMIT = 20;

const buildCatalogParams = (
  page: number,
  categoryId: number | undefined,
  search: string | undefined,
  state: CatalogFilterState,
) => {
  const params: CatalogParams = {
    limit: String(LIMIT),
    page: String(page),
    sort: state.sort || "popular",
  };
  if (categoryId) params.category_id = String(categoryId);
  if (search) params.search = search;
  if (state.priceFrom) params.price_from = state.priceFrom;
  if (state.priceTo) params.price_to = state.priceTo;
  if (state.specifications.length > 0) params.specifications = state.specifications.join(",");
  if (state.country.length > 0) params.country = state.country.join(",");
  if (state.productTypes.length > 0) params.product_types = state.productTypes.join(",");
  return params;
};

export const ProductsView = (props: Props) => {
  const [count, setCount] = useState<number>(0);
  const width = getWidthCard(Dimensions.get("window").width, 8, 4, 2);

  const { data, isHasMore, loadMore, resetData, reload, loading } = useInfiniteScroll<ProductModel>(
    {
      limit: LIMIT,
      fetchData: (page: number) =>
        fetchCatalogProducts(
          buildCatalogParams(page, props.categoryId, props.search, props.filterState),
        ).then((response) => {
          if (response.status === "success" && response.data) {
            setCount(response.data.totalCount);
            props.onCountChange?.(response.data.totalCount);
            return { data: response.data.products, total: response.data.totalCount };
          } else {
            throw response.message || "Не удалось загрузить товары";
          }
        }),
    },
  );

  //ERROR Перезагрузка товаров при изменении фильтров
  useEffect(() => {
    if (data.length === 0 && count === 0) return;
    resetData();
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.filterState.sort,
    props.filterState.priceFrom,
    props.filterState.priceTo,
    props.filterState.specifications,
    props.filterState.country,
    props.filterState.productTypes,
  ]);

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        onEndReached={() => isHasMore && loadMore()}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={styles.listHeaderComponentStyle}
        ListHeaderComponent={
          <View style={styles.content}>
            {props.title && (
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{props.title}</Text>
              </View>
            )}

            {data.length === 0 && count === 0 && !loading && (
              <NotContent
                title="Товары не найдены"
                subTitle="Попробуйте изменить параметры поиска"
              />
            )}
          </View>
        }
        ListFooterComponentStyle={styles.listFooterComponentStyle}
        ListFooterComponent={
          <View style={styles.footerListPadding}>
            {loading && <ActivityIndicator size="small" color="#a73afd" />}
            <ProductRecent navigation={props.navigation} isHasNavigateSeeAll />
          </View>
        }
        renderItem={({ item, index }) => (
          <ProductCard
            width={width}
            priceList={item.price_list}
            index={index}
            photos={item.photos}
            accounting={item.accounting}
            available={item.available}
            id={item.id}
            name={item.name}
            rating={item.rating}
            reviewCount={item.review_count}
            brand_name={item.brand_name}
            navigation={props.navigation}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  listHeaderComponentStyle: {
    rowGap: 4,
    paddingTop: 8,
  },
  content: {
    rowGap: 12,
  },
  header: {
    rowGap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#242424",
  },
  columnWrapper: {
    columnGap: 4,
  },
  listContent: {
    paddingBottom: 0,
    rowGap: 12,
    paddingHorizontal: 8,
  },
  listFooterComponentStyle: {
    paddingTop: 16,
    rowGap: 16,
  },
  footerListPadding: {
    rowGap: 16,
  },
});
