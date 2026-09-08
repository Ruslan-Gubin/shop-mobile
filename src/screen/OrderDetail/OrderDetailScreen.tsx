import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import {
  formatDateRu,
  formatDeliveryInterval,
  formatterRub,
} from "../../shared/helpers/formatters";
import { getFullAddressItem } from "../../shared/helpers/getFullAddressItem";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { getOrderStatusColor, getOrderStatusLabel } from "../../shared/helpers/orderStatus";
import type { OrderModel } from "../../shared/types/order";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { NotContent } from "../../widgets/not-content/NotContent";
import { MapBox } from "../Checkout/components/map/MapBox";
import { OrderProductList } from "./components/OrderProductList";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "OrderDetail">;
  route?: { params?: { id: number } };
};

export const OrderDetailScreen = (props: Props) => {
  const id = props.route?.params?.id;

  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderEvent = useEffectEvent((id: number) => {
    const defaultErrorMessage = "Не удалось загрузить заказ";

    fetchService
      .get<OrderModel>({ url: `orders/${id}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setOrder(response.data);
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
              fetchOrderEvent(id);
              setError("");
            },
          },
        ]);
        setError(message);
      })
      .finally(() => loading && setLoading(false));
  });

  useEffect(() => {
    if (typeof id === "number" && !Number.isNaN(id)) {
      fetchOrderEvent(id);
    } else {
      setLoading(false);
    }
  }, [id]);

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
          {/* Шапка — номер, дата и статус */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.orderNumber}>Статус</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getOrderStatusColor(order.status)}18`,
                    borderColor: `${getOrderStatusColor(order.status)}40`,
                  },
                ]}
              >
                <Text
                  style={[styles.statusBadgeText, { color: getOrderStatusColor(order.status) }]}
                >
                  {getOrderStatusLabel(order.status)}
                </Text>
              </View>
            </View>

            <View style={styles.headerDateRow}>
              <Text style={styles.infoLabel}>Дата оформления</Text>
              <Text style={styles.infoValue}>
                {formatDateRu(order.created_at, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            {order.rejected_reason && (
              <Text style={styles.rejectedText}>
                <Text style={styles.infoLabel}>Причина отмены: </Text>
                {order.rejected_reason}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {order.method_receipt === "courier" ? "Доставка" : "Самовывоз"}
            </Text>
            {order.date_from && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>
                  {order.method_receipt === "courier" ? "Дата доставки" : "Дата выдачи"}
                </Text>
                <Text style={styles.cardValue}>
                  {formatDeliveryInterval(order.date_from, order.date_to)}
                </Text>
              </View>
            )}
            {order.status === "completed" && order.updated_at && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Дата выдачи</Text>
                <Text style={styles.cardValue}>
                  {formatDateRu(order.updated_at, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
            {order.recipient_name && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Получатель</Text>
                <Text style={styles.cardValue}>{order.recipient_name}</Text>
              </View>
            )}
            {order.phone && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Телефон</Text>
                <Text style={styles.cardValue}>
                  {order.phoneCode}
                  {order.phone}
                </Text>
              </View>
            )}
            {order.comment && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>
                  Комментарий: <Text>{order.comment}</Text>
                </Text>
              </View>
            )}
            {order.address && (
              <Text style={styles.rejectedText}>
                <Text style={styles.infoLabel}>
                  {order.method_receipt === "courier" ? "Адрес: " : "Склад"}{" "}
                </Text>
                {getFullAddressItem(order.address)}
              </Text>
            )}
            {order.address &&
              typeof order.address.lat === "number" &&
              typeof order.address.lng === "number" &&
              !Number.isNaN(order.address.lat) &&
              !Number.isNaN(order.address.lng) &&
              order.address.lng >= -180 &&
              order.address.lng <= 180 &&
              order.address.lat >= -90 &&
              order.address.lat <= 90 && (
                <View style={styles.mapContainer}>
                  <MapBox
                    markers={[order.address]}
                    onClickMarker={() => {}}
                    initCenter={{ lat: order.address.lat, lng: order.address.lng }}
                    active={{ lat: order.address.lat, lng: order.address.lng }}
                  />
                </View>
              )}
          </View>
          {typeof id === "number" && !Number.isNaN(id) && (
            <OrderProductList order_id={id} navigation={props.navigation} />
          )}

          {/* Оплата */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Оплата</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Способ оплаты</Text>
              <Text style={styles.cardValue}>
                {order.payment_method === "card" ? "Банковской картой" : "Наличными"}
              </Text>
            </View>

            {order.subtotal > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Всего на сумму</Text>
                <Text style={styles.totalValue}>{formatterRub.format(order.subtotal)}</Text>
              </View>
            )}

            {order.discount_quantity > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Скидка за количество</Text>
                <Text style={styles.totalValue}>
                  −{formatterRub.format(order.discount_quantity)}
                </Text>
              </View>
            )}
            {order.discount_percent > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {order.discount_name ? order.discount_name : "Процент скидки"}
                </Text>
                <Text style={styles.totalValue}>- {order.discount_percent}%</Text>
              </View>
            )}
            {typeof order.discount_total === "number" &&
              typeof order.discount_quantity === "number" &&
              order.discount_total + order.discount_quantity > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Скидка всего</Text>
                  <Text style={styles.totalValue}>
                    −{formatterRub.format(order.discount_total + order.discount_quantity)}
                  </Text>
                </View>
              )}

            {order.method_receipt === "courier" && (
              <View style={styles.totalRow}>
                <Text style={styles.cardLabel}>Стоимость доставки</Text>
                <Text style={styles.cardValue}>{formatterRub.format(100)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            {order.total > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.grandTotal}>Всего</Text>
                <Text style={styles.grandTotal}>{formatterRub.format(order.total)}</Text>
              </View>
            )}
          </View>
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
  header: {
    rowGap: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
  },
  headerLeft: {
    flex: 1,
    rowGap: 4,
  },
  headerDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "400",
    color: "#242424",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#242424",
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
  },
  statusBadge: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  card: {
    rowGap: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#242424",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#242424",
  },
  cardValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
    color: "#242424",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f1f5",
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#242424",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
    textAlign: "right",
  },
  rejectedText: {
    fontSize: 14,
    color: "#242424",
  },
  mapContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
});
