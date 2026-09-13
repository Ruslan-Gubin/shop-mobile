import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import type { OrderModel, OrderProductModel } from "../../shared/types/order";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { NotContent } from "../../widgets/not-content/NotContent";
import { DeliveryInfo } from "./components/DeliveryInfo";
import { DetailPaid } from "./components/DetailPaid";
import { MainInfo } from "./components/MainInfo";
import { OrderProductList } from "./components/OrderProductList";
import { PriceChangeBlock } from "./components/PriceChangeBlock";
import { StockShortageBlock } from "./components/StockShortageBlock";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "OrderDetail">;
  route?: { params?: { id: number } };
};

export const OrderDetailScreen = (props: Props) => {
  const id = props.route?.params?.id;

  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderProducts, setOrderProducts] = useState<OrderProductModel[]>([]);
  const [orderProductsLoading, setOrderProductsLoading] = useState(false);

  const fetchOrderProductsEvent = useEffectEvent((id: number) => {
    setOrderProductsLoading(true);

    fetchService
      .get<OrderProductModel[]>({ url: `order-product/order/${id}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setOrderProducts(response.data);
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось получить список товаров для заказа");
        setError(message);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchOrderProductsEvent(id);
              setError("");
            },
          },
        ]);
      })
      .finally(() => setOrderProductsLoading(false));
  });

  const fetchOrderEvent = useEffectEvent((id: number) => {
    const defaultErrorMessage = "Не удалось загрузить заказ";

    fetchService
      .get<OrderModel>({ url: `orders/${id}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setOrder(response.data);
        } else {
          throw response.message;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        setError(message);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchOrderEvent(id);
              setError("");
            },
          },
        ]);
      })
      .finally(() => loading && setLoading(false));
  });

  useEffect(() => {
    if (typeof id === "number" && !Number.isNaN(id)) {
      fetchOrderEvent(id);
      fetchOrderProductsEvent(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const hasShortageStocks =
    orderProducts.length > 0 &&
    orderProducts.some((el) => Array.isArray(el.shortage_stocks) && el.shortage_stocks.length > 0);

  return (
    <View style={styles.page}>
      <PageHeader
        title={order?.order_number ? `Заказ № ${order.order_number}` : "Заказ"}
        onBack={() => props.navigation?.goBack()}
      />

      {error.length > 0 && <ErrorAlert message={error} />}

      {loading && (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color="#a73afd" />
        </View>
      )}

      {!loading && !order && (
        <NotContent
          title="Заказ не найден"
          subTitle="Попробуйте перезагрузить страницу или вернутся к список заказов"
          navigateText="Вернутся к списку заказов"
          onNavigate={() => props.navigation?.push("Orders")}
        />
      )}

      {!loading && order && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {hasShortageStocks &&
            ["new", "processing"].includes(order.status) &&
            typeof id === "number" &&
            !Number.isNaN(id) && (
              <StockShortageBlock
                order_id={id}
                products={orderProducts}
                loading={orderProductsLoading}
                navigation={props.navigation}
              />
            )}

          {Array.isArray(order.price_changes) &&
            order.price_changes.length > 0 &&
            ["new", "processing"].includes(order.status) &&
            typeof id === "number" &&
            !Number.isNaN(id) && (
              <PriceChangeBlock
                order_id={id}
                items={order.price_changes}
                products={orderProducts}
                loading={orderProductsLoading}
                navigation={props.navigation}
              />
            )}

          <MainInfo
            status={order.status}
            method_receipt={order.method_receipt}
            created_at={order.created_at}
            rejected_reason={order.rejected_reason}
            id={id}
            navigation={props.navigation}
            date_from={order.date_from}
            date_to={order.date_to}
          />

          <DeliveryInfo
            method_receipt={order.method_receipt}
            comment={order.comment}
            address={order.address}
            date_from={order.date_from}
            date_to={order.date_to}
            phone={order.phone}
            phoneCode={order.phoneCode}
            recipient_name={order.recipient_name}
            status={order.status}
            updated_at={order.updated_at}
          />

          {typeof id === "number" && !Number.isNaN(id) && orderProducts.length > 0 && (
            <OrderProductList
              navigation={props.navigation}
              order_status={order.status}
              products={orderProducts}
              productsLoading={orderProductsLoading}
              ids={orderProducts.map((el) => el.product_id).join(",")}
            />
          )}

          <DetailPaid
            discount_name={order.discount_name}
            discount_quantity={order.discount_quantity}
            discount_total={order.discount_total}
            method_receipt={order.method_receipt}
            payment_method={order.payment_method}
            subtotal={order.subtotal}
            total={order.total}
            discount_percent={order.discount_percent}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    rowGap: 8,
    paddingBlock: 8,
  },
});
