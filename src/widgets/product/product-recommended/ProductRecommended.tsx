import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { getWidthCard } from "../../../shared/helpers/getWidthCard";
import type { ProductModel } from "../../../shared/types/products";
import { ErrorAlert } from "../../../shared/ui/ErrorAlert/ErrorAlert";
import { basketStore } from "../../../store/basket/store";
import { favoritesStore } from "../../../store/favorites/store";
import { recentStore } from "../../../store/recent/store";
import { ProductCard } from "../product-card/ProductCard";

type Props = {
  title: string;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const ProductRecommended = (props: Props) => {
  const [data, setData] = useState<ProductModel[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const recent = recentStore((store) => store.items);
  const favorites = favoritesStore((store) => store.items);
  const basket = basketStore((store) => store.items);

  const defaultErrorMessage = "Не удалось получить список рекомендуемых товаров";

  const recentIds = recent.join(",");
  const favoriteIds = Object.keys(favorites).join(",");
  const basketIds = Object.keys(basket).join(",");

  const limit = 30;
  const width = getWidthCard(Dimensions.get("window").width, 24, 4, 2);

  const fetchRecommendedEvent = useEffectEvent(() =>
    fetchService
      .get<ProductModel[]>({
        url: "product/recommended",
        params: {
          favorite_ids: favoriteIds,
          cart_ids: basketIds,
          viewed_ids: recentIds,
          limit: String(limit),
        },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              setIsError(false);
            },
          },
        ]);

        setIsError(true);
      }),
  );

  useEffect(() => {
    fetchRecommendedEvent();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            {props.title && (
              <View style={styles.header}>
                <Text style={styles.title}>{props.title}</Text>
              </View>
            )}
          </View>
        }
        data={data}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={{ columnGap: 4 }}
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
        ListFooterComponent={
          <View style={styles.footerListPadding}>
            {isError && <ErrorAlert message={defaultErrorMessage} />}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
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
