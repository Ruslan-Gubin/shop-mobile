import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { getWidthCard } from "../../shared/helpers/getWidthCard";
import { ArrowBackIcon } from "../../shared/svg/ArrowBackIcon";
import type { ProductModel } from "../../shared/types/products";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
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
  const width = getWidthCard(Dimensions.get("window").width, 0, 4, 2);
  const defaultErrorMessage = "Не удалось получить список просмотренных товаров";

  const fetchRecentData = () => {
    fetchService
      .get<ProductModel[]>({
        url: "product/by-ids",
        params: { ids: recent.toString() },
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
              fetchRecentData();
              setIsError(false);
            },
          },
        ]);
      });
  };

  useEffect(() => {
    fetchRecentData();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {props.navigation && (
          <Pressable onPress={() => props.navigation?.goBack()} style={styles.buttonBackIcon}>
            <ArrowBackIcon fill="black" size={24} />
          </Pressable>
        )}
        <Text style={styles.title}>Вы смотрели</Text>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    paddingInline: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonBackIcon: {
    borderRadius: 8,
    backgroundColor: "#f1f1f5",
  },
  listContent: {
    paddingBottom: 20,
    rowGap: 12,
  },
});
