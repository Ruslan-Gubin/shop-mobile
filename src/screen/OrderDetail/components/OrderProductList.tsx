import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import type { OrderProductModel, OrderStatus } from "../../../shared/types/order";
import type { ProductModel } from "../../../shared/types/products";
import { ErrorAlert } from "../../../shared/ui/ErrorAlert/ErrorAlert";
import { NotContent } from "../../../widgets/not-content/NotContent";
import { OrderProductCard } from "./OrderProductCard";

type Props = {
  order_status: OrderStatus;
  products: OrderProductModel[];
  productsLoading: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  ids: string;
};

export const OrderProductList = (props: Props) => {
  const [productsOrigin, setProductsOrigin] = useState<ProductModel[]>([]);
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [error, setError] = useState("");

  const fetchOriginProductsEvent = useEffectEvent((ids: string) => {
    const defaultError = "Не удалось получить список товаров";

    if (typeof ids === "string" && ids.length > 0) {
      setLoadingOrigin(true);

      fetchService
        .get<ProductModel[]>({
          url: "product/by-ids",
          params: { ids },
        })
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setProductsOrigin(response.data);
          } else if (response.status === "error") {
            throw response.message;
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultError);
          setError(message);
        })
        .finally(() => {
          setLoadingOrigin(false);
        });
    }
  });

  useEffect(() => {
    fetchOriginProductsEvent(props.ids);
  }, [props.ids]);

  const isLoading = props.productsLoading || loadingOrigin;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Состав заказа</Text>

      {isLoading && (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="small" color="#a73afd" />
        </View>
      )}

      {error.length > 0 && <ErrorAlert message={error} />}

      {!isLoading && (props.products.length === 0 || productsOrigin.length === 0) && (
        <NotContent
          title="Не удалось получить список товаров"
          subTitle="Попробуйте перезагрузить страницу"
        />
      )}

      <View style={styles.list}>
        {!isLoading &&
          props.products.length > 0 &&
          productsOrigin.length > 0 &&
          props.products.map((product) => (
            <OrderProductCard
              product_id={product.product_id}
              navigation={props.navigation}
              description={product.description}
              key={product.id}
              quantity={product.quantity}
              name={product.name}
              price={product.price}
              order_status={props.order_status}
              photos={productsOrigin.find((el) => el.id === product.product_id)?.photos || []}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    rowGap: 12,
    paddingVertical: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    paddingHorizontal: 12,
    fontWeight: "600",
    color: "#242424",
  },
  list: {
    paddingHorizontal: 12,
  },
});

