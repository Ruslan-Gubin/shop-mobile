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
  order_id: number;
  order_status: OrderStatus;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const OrderProductList = (props: Props) => {
  const [productsOrigin, setProductsOrigin] = useState<ProductModel[]>([]);
  const [products, setProducts] = useState<OrderProductModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOriginProducts = (ids: string) => {
    const defaultError = "Не удалось получить список товаров";

    if (typeof ids === "string" && ids.length > 0) {
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
          setLoading(false);
        });
    }
  };

  const fetchProductsEvent = useEffectEvent((id: number) => {
    setLoading(true);
    const defaultErrorMessage = "Не удалось загрузить товары";

    fetchService
      .get<OrderProductModel[]>({ url: `order-product/order/${id}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setProducts(response.data);
          fetchOriginProducts(response.data.map((el) => el.product_id).join(","));
        } else {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        setError(message);
        setLoading(false);
      });
  });

  useEffect(() => {
    fetchProductsEvent(props.order_id);
  }, [props.order_id]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Состав заказа</Text>
      {loading && (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="small" color="#a73afd" />
        </View>
      )}

      {error.length > 0 && <ErrorAlert message={error} />}

      {!loading && (products.length === 0 || productsOrigin.length === 0) && (
        <NotContent
          title="Не удалось получить список товаров"
          subTitle="Попробуйте перезагрузить страницу"
        />
      )}

      <View style={styles.list}>
        {!loading &&
          products.length > 0 &&
          productsOrigin.length > 0 &&
          products.map((product) => (
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
