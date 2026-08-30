import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { getWidthCard } from "../../shared/helpers/getWidthCard";
import type { ProductModel } from "../../shared/types/products";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { favoritesStore } from "../../store/favorites/store";
import { ProductCard } from "../../widgets/product/product-card/ProductCard";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Favorites">;
  route?: {
    key: string;
    name: string;
    params?: Record<string, string>;
  };
};

export const FavoritesScreen = (props: Props) => {
  const [favoritesData, setFavoritesData] = useState<ProductModel[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const favorites = favoritesStore((state) => state.items);
  const width = getWidthCard(Dimensions.get("window").width, 0, 4, 2);
  const defaultErrorMessage = "Не удалось получить список избранных товаров";
  const favoritesIds = Object.keys(favorites).join(",");

  const fetchFavoritesData = useEffectEvent((favoritesIds: string) => {
    fetchService
      .get<ProductModel[]>({
        url: "product/by-ids",
        params: { ids: favoritesIds },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setFavoritesData(response.data);
        } else {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        setIsError(true);

        Alert.alert("Ошибка", message, [
          {
            text: "Отмена",
            style: "default",
          },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchFavoritesData(favoritesIds);
              setIsError(false);
            },
          },
        ]);
      });
  });

  useEffect(() => {
    fetchFavoritesData(favoritesIds);
  }, [favoritesIds]);

  return (
    <View style={styles.root}>
      <PageHeader title="Избранное" onBack={() => props?.navigation?.goBack()} />
      {isError && <ErrorAlert message={defaultErrorMessage} />}
      {favoritesData.length > 0 && (
        <FlatList
          data={favoritesData}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={{ columnGap: 4 }}
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
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
  },
  listContent: {
    paddingBlock: 16,
    paddingBottom: 20,
    rowGap: 12,
  },
});
