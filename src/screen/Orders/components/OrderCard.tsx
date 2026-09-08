import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  formatDateRu,
  formatDeliveryInterval,
  formatterRub,
} from "../../../shared/helpers/formatters";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../shared/helpers/orderStatus";
import type { OrderModel } from "../../../shared/types/order";

type Props = {
  order: OrderModel;
  navigation?: NativeStackNavigationProp<ParamListBase, "Orders">;
};

export const OrderCard = (props: Props) => {
  const { order } = props;
  const statusColor = getOrderStatusColor(order.status);
  const statusLabel = getOrderStatusLabel(order.status);

  const handlePress = () => {
    props.navigation?.navigate("OrderDetail", { id: order.id });
  };

  const receiptLabel = order.method_receipt === "courier" ? "Курьер" : "Самовывоз";
  const paymentLabel = order.payment_method === "card" ? "Карта" : "Наличные";
  const orderDate = order.created_at
    ? formatDateRu(order.created_at, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const deliveryLabel = formatDeliveryInterval(order.date_from, order.date_to);
  const hasDiscount = typeof order.discount_total === "number" && order.discount_total > 0;
  const basePrice =
    typeof order.subtotal === "number" && order.subtotal > 0 ? order.subtotal : order.total;
  const isCancelled = order.status.startsWith("cancelled");
  const showTotal = !isCancelled && !order.rejected_reason;
  const showDiscount = hasDiscount && showTotal;

  return (
    <Pressable style={styles.root} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderNumber}>№ {order.order_number}</Text>
        </View>
        {statusLabel && statusColor && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}18`, borderColor: `${statusColor}40` },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBlock}>
        {orderDate.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Дата оформления</Text>
            <Text style={styles.infoValue}>{orderDate}</Text>
          </View>
        )}
        {deliveryLabel.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {order.method_receipt === "courier" ? "Доставка" : "К выдаче"}
            </Text>
            <Text style={styles.infoValue}>{deliveryLabel}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Получение</Text>
          <Text style={styles.infoValue}>{receiptLabel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Оплата</Text>
          <Text style={styles.infoValue}>{paymentLabel}</Text>
        </View>
        {showDiscount && (
          <>
            {basePrice > 0 && !Number.isNaN(basePrice) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Цена без скидки</Text>
                <Text style={styles.infoValue}>{formatterRub.format(basePrice)}</Text>
              </View>
            )}

            {order.discount_quantity > 0 && !Number.isNaN(order.discount_quantity) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Скидка за количество</Text>
                <Text style={styles.infoValue}>
                  −{formatterRub.format(order.discount_quantity)}
                </Text>
              </View>
            )}

            {order.discount_percent > 0 && !Number.isNaN(order.discount_percent) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {order.discount_name ? order.discount_name : "Процент скидки"}
                </Text>
                <Text style={styles.infoValue}>- {order.discount_percent}%</Text>
              </View>
            )}

            {order.discount_total > 0 && !Number.isNaN(order.discount_total) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Скидка всего</Text>
                <Text style={styles.infoValue}>
                  −{formatterRub.format(order.discount_total + order.discount_quantity)}
                </Text>
              </View>
            )}

            {order.method_receipt === "courier" && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Стоимость доставки</Text>
                <Text style={styles.infoValue}>{formatterRub.format(100)}</Text>
              </View>
            )}
          </>
        )}
        {order.recipient_name && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Получатель</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {order.recipient_name}
            </Text>
          </View>
        )}
        {order.rejected_reason && (
          <Text style={styles.rejectedText} numberOfLines={2}>
            <Text style={styles.infoLabel}>Причина отмены: </Text>
            {order.rejected_reason}
          </Text>
        )}
      </View>

      {showTotal && order.total > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Итого</Text>
          <Text style={styles.totalValue}>{formatterRub.format(order.total)}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: 600,
  },
  infoBlock: {
    marginTop: 14,
    rowGap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#242424",
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
  },
  rejectedText: {
    fontSize: 14,
    color: "#242424",
  },
  totalRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
  },
});
