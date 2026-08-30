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
import { recentStore } from "../../store/recent/store";
import { ProductCard } from "../../widgets/product/product-card/ProductCard";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Search">;
  route?: {
    key: string;
    name: string;
    params?: Record<string, string>;
  };
};

export const RecentScreen = (props: Props) => {
  const [recentData, setRecentData] = useState<ProductModel[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const recent = recentStore((state) => state.items);
  const recentIds = recent.join(",");
  const width = getWidthCard(Dimensions.get("window").width, 0, 4, 2);
  const defaultErrorMessage = "Не удалось получить список просмотренных товаров";

  const fetchRecentData = useEffectEvent((recentIds: string) => {
    if (recentIds.length > 0) {
      fetchService
        .get<ProductModel[]>({
          url: "product/by-ids",
          params: { ids: recentIds },
        })
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setRecentData(response.data);
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
              onPress: () => {
                setIsError(false);
              },
            },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                fetchRecentData(recentIds);
                setIsError(false);
              },
            },
          ]);
        });
    }
  });

  useEffect(() => {
    fetchRecentData(recentIds);
  }, [recentIds]);

  return (
    <View style={styles.root}>
      <PageHeader title="Вы смотрели" onBack={() => props?.navigation?.goBack()} />
      {isError && (
        <ErrorAlert
          message={defaultErrorMessage}
          callback={{
            action() {
              props?.navigation?.push("Home");
            },
            text: "Вернутся на главную",
          }}
        />
      )}
      {recentData.length > 0 && (
        <FlatList
          data={recentData}
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
    rowGap: 16,
    backgroundColor: "white",
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    rowGap: 12,
  },
});
