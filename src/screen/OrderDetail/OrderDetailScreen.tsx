import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { declOfNum } from "../../shared/helpers/declOfNum";
import { formatterRub } from "../../shared/helpers/formatters";
import { getOrderStatusColor, getOrderStatusLabel } from "../../shared/helpers/orderStatus";
import type { OrderModel, OrderStatus } from "../../shared/types/order";
import { PageHeader } from "../../shared/ui/header/PageHeader";

/* ---------- мок-данные (пока нет GET /orders/[id]) ---------- */

const MOCK_PRODUCTS = [
  { name: "Платье летнее", count: 1, price: 4500 },
  { name: "Сумка кожаная", count: 2, price: 3500 },
  { name: "Туфли", count: 1, price: 6200 },
];

const MOCK_STATUSES: OrderStatus[] = ["new", "processing", "in_delivery", "completed"];

const mockOrder = (id: number): OrderModel => ({
  id,
  create_user_id: 1,
  order_number: `ORD-${String(id).padStart(6, "0")}`,
  comment: "",
  status: MOCK_STATUSES[id % MOCK_STATUSES.length],
  rejected_reason: "",
  phone: "+7 (999) 123-45-67",
  phoneCode: "+7",
  recipient_name: "Иван Петров",
  payment_method: id % 2 === 0 ? "card" : "cash",
  method_receipt: id % 3 === 0 ? "pickup" : "courier",
  date_from: new Date(Date.now() + 86400000),
  date_to: new Date(Date.now() + 86400000 + 3600000),
  discount: Math.floor(Math.random() * 1000) + 200,
  created_at: new Date(),
  updated_at: null,
});

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatDeliveryDate = (date: Date | null | undefined): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
};

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "OrderDetail">;
  route: { params?: { id?: number } };
};

export const OrderDetailScreen = ({ navigation, route }: Props) => {
  const orderId = route?.params?.id ?? Number.NaN;
  const isInvalidId = Number.isNaN(orderId);

  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(!isInvalidId);

  useEffect(() => {
    // TODO: заменить на реальный fetch GET /orders/{id}
    if (isInvalidId) {
      return;
    }

    const timer = setTimeout(() => {
      setOrder(mockOrder(orderId));
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [orderId, isInvalidId]);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (loading) {
    return (
      <View style={styles.page}>
        <PageHeader title="" onBack={() => navigation.goBack()} />
        <View style={styles.centerBlock}>
          <Text style={styles.errorText}>Загрузка заказа…</Text>
        </View>
      </View>
    );
  }

  if (!order || isInvalidId) {
    return (
      <View style={styles.page}>
        <PageHeader title="" onBack={() => navigation.goBack()} />
        <View style={styles.centerBlock}>
          <Text style={styles.errorText}>Заказ не найден</Text>
        </View>
      </View>
    );
  }

  const receiptLabel = order.method_receipt === "courier" ? "Курьер" : "Самовывоз";
  const paymentLabel = order.payment_method === "card" ? "Банковской картой" : "Наличными";
  const statusColor = getOrderStatusColor(order.status);

  const total = MOCK_PRODUCTS.reduce((sum, p) => sum + p.price * p.count, 0);
  const deliveryPrice = order.method_receipt === "courier" ? 100 : 0;
  const grandTotal = total - order.discount + deliveryPrice;

  return (
    <View style={styles.page}>
      <PageHeader title="Заказ" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {/* Шапка — номер и статус */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.orderNumber}>Заказ {order.order_number}</Text>
            <Text style={styles.orderDate}>от {formatDate(order.created_at)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}18`, borderColor: `${statusColor}40` },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {getOrderStatusLabel(order.status)}
            </Text>
          </View>
        </View>

        {/* Доставка */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Доставка</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Способ получения</Text>
            <Text style={styles.cardValue}>{receiptLabel}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Дата доставки</Text>
            <Text style={styles.cardValue}>
              {formatDeliveryDate(order.date_from)}{" "}
              {order.date_from && order.date_to
                ? `${new Date(order.date_from).getHours()}:00 – ${new Date(
                    order.date_to,
                  ).getHours()}:00`
                : ""}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Получатель</Text>
            <Text style={styles.cardValue}>{order.recipient_name}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Телефон</Text>
            <Text style={styles.cardValue}>{order.phone}</Text>
          </View>
          {order.comment && (
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Комментарий</Text>
              <Text style={styles.cardValue}>{order.comment}</Text>
            </View>
          )}
        </View>

        {/* Оплата */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Оплата</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Способ оплаты</Text>
            <Text style={styles.cardValue}>{paymentLabel}</Text>
          </View>
        </View>

        {/* Состав заказа */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Состав заказа</Text>
          {MOCK_PRODUCTS.map((product, idx) => (
            <View key={idx}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCount}>
                    {product.count} {declOfNum(product.count, ["шт.", "шт.", "шт."])}
                  </Text>
                </View>
                <Text style={styles.productPrice}>
                  {formatterRub.format(product.price * product.count)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Итого */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Товары</Text>
            <Text style={styles.totalValue}>{formatterRub.format(total)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Скидка</Text>
            <Text style={styles.totalValue}>−{formatterRub.format(order.discount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Доставка</Text>
            <Text style={styles.totalValue}>
              {deliveryPrice > 0 ? formatterRub.format(deliveryPrice) : "Бесплатно"}
            </Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.grandTotal}>{formatterRub.format(grandTotal)}</Text>
        </View>
      </ScrollView>
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
    rowGap: 12,
    padding: 12,
  },
  contentDesktop: {
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  errorText: {
    color: "#868695",
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
  },
  headerInfo: {
    flex: 1,
    rowGap: 4,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: "600",
    color: "#242424",
  },
  orderDate: {
    fontSize: 13,
    color: "#868695",
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
    borderRadius: 16,
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
    color: "#868695",
  },
  cardValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#242424",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    columnGap: 12,
  },
  productInfo: {
    flex: 1,
    rowGap: 4,
  },
  productName: {
    fontSize: 14,
    color: "#242424",
  },
  productCount: {
    fontSize: 13,
    color: "#868695",
  },
  productPrice: {
    fontSize: 14,
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
    color: "#868695",
  },
  totalValue: {
    fontSize: 14,
    color: "#242424",
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
    textAlign: "right",
  },
});
