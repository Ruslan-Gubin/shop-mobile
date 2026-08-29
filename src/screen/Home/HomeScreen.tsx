import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { getWidthCard } from "../../shared/helpers/getWidthCard";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../shared/types/products";
import { SearchNavigateButton } from "../../widgets/home/search-navigate-button/SearchNavigateButton";
import { Login } from "../../widgets/modal/login/Login";
import { ProductCard } from "../../widgets/product/product-card/ProductCard";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Search">;
  route?: {
    key: string;
    name: string;
    params?: Record<string, string>;
  };
};

export const HomeScreen = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const limit = 30;
  const width = getWidthCard(Dimensions.get("window").width, 0, 4, 2);

  const { data, isHasMore, loadMore, loading, reload } = useInfiniteScroll({
    limit,
    fetchData: (page: number) =>
      fetchService
        .get<{ products: ProductModel[]; paginationPage: string; totalCount: number }>({
          url: "product/main-page",
          params: {
            limit: String(limit),
            page: page ? String(page) : "1",
          },
        })
        .then((response) => {
          if (response.status === "success" && response.data) {
            return { data: response.data.products, total: response.data.totalCount };
          } else {
            throw response.message || "Не удалось загрузить товары";
          }
        })
        .catch((error) => {
          const message = getMessageError(error, "Не удалось загрузить товары");

          Alert.alert("Ошибка", message, [
            { text: "Отмена", style: "default" },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                reload();
                setIsError(false);
              },
            },
          ]);
          setIsError(true);

          return { data: [], total: 0 };
        }),
  });

  return (
    <View style={styles.root}>
      <Login visible={open} onClose={() => setOpen(false)} />
      <SearchNavigateButton onPress={() => props?.navigation?.push("Search")} />
      <FlatList
        data={data}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={{ columnGap: 4 }}
        onEndReached={() => isHasMore && !isError && loadMore()}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
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
          );
        }}
        ListFooterComponent={
          <View style={styles.footerListPadding}>
            {loading && <ActivityIndicator size="small" color="#a73afd" />}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    paddingTop: 60,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 0,
    rowGap: 12,
  },
  footerListPadding: {
    height: 22,
  },
});
