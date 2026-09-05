import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getWidthCard } from "../../../shared/helpers/getWidthCard";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../../shared/types/products";
import { NotContent } from "../../../widgets/not-content/NotContent";
import { ProductCard } from "../../../widgets/product/product-card/ProductCard";
import { ProductRecent } from "../../../widgets/product/product-recent/ProductRecent";
import { buildCatalogParams } from "../helpers/buildCatalogParams";
import type { CatalogFilter } from "../types";

type Props = {
  category_id: number;
  search: string;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  onCountChange?: (count: number) => void;
  filters: CatalogFilter;
};

export const ProductsView = (props: Props) => {
  const width = getWidthCard(Dimensions.get("window").width, 0, 4, 2);
  const LIMIT = 20;

  const { data, isHasMore, loadMore, reload, loading, total } = useInfiniteScroll<ProductModel>({
    limit: LIMIT,
    fetchData: (page: number) =>
      fetchService
        .get<{
          products: ProductModel[];
          totalCount: number;
          paginationPage: string;
        }>({
          url: "product/catalog",
          params: buildCatalogParams(
            page ? String(page) : "1",
            String(LIMIT),
            props.category_id,
            props.search,
            props.filters,
          ),
        })
        .then((response) => {
          if (response.status === "success" && response.data) {
            props.onCountChange?.(response.data.totalCount);
            return { data: response.data.products, total: response.data.totalCount };
          } else {
            throw response.message || "Не удалось загрузить товары";
          }
        }),
  });

  useEffect(() => {
    reload();
  }, [props.filters]);

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
        ListEmptyComponent={
          <NotContent title="Товары не найдены" subTitle="Попробуйте изменить параметры поиска" />
        }
        ListFooterComponentStyle={styles.listFooterComponentStyle}
        ListFooterComponent={
          <>
            {loading && <ActivityIndicator size="small" color="#a73afd" />}
            {data.length >= total && (
              <ProductRecent navigation={props.navigation} isHasNavigateSeeAll />
            )}
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    rowGap: 2,
  },
  columnWrapper: {
    paddingTop: 8,
    columnGap: 4,
  },
  listContent: {
    rowGap: 12,
  },
  listFooterComponentStyle: {
    paddingTop: 16,
    rowGap: 16,
    paddingHorizontal: 12,
  },
});
