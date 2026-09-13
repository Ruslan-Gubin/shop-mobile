import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { formatDateRu, formatDeliveryIntervalHours } from "../../../shared/helpers/formatters";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../shared/helpers/orderStatus";
import type { OrderStatus } from "../../../shared/types/order";
import { CancelOrderModal } from "./CancelOrderModal";

type Props = {
  status: OrderStatus;
  method_receipt: string;
  created_at: Date | null;
  rejected_reason: string;
  id: number | undefined;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  date_from: Date | null;
  date_to: Date | null;
};

export const MainInfo = (props: Props) => {
  const CANCELLED_STATUSES: OrderStatus[] = [
    "cancelled_new",
    "cancelled_assembly",
    "cancelled_ready",
    "cancelled_delivery",
    "cancelled_customer",
  ];

  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.statusBadgeText, { color: getOrderStatusColor(props.status) }]}>
            {getOrderStatusLabel(props.status)}
          </Text>
        </View>
      </View>
      {props.status === "ready" && (
        <View style={styles.readyNotice}>
          <View style={styles.readyIcon}>
            <Text style={styles.readyIconText}>✓</Text>
          </View>
          <View style={styles.readyTextWrap}>
            <Text style={styles.readyTitle}>
              {props.method_receipt === "courier"
                ? "Заказ готов к доставке"
                : "Заказ готов к выдаче"}
            </Text>
            <Text style={styles.readyBody}>
              {props.method_receipt === "courier"
                ? "Ваш заказ собран. Передадим его курьеру — следите за обновлением статуса."
                : `Ваш заказ собран и ждёт вас. Забрать можно на складе ${formatDeliveryIntervalHours(props.date_from, props.date_to)}.`}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.headerDateRow}>
        <Text style={styles.infoLabel}>Дата оформления</Text>
        <Text style={styles.infoValue}>
          {formatDateRu(props.created_at, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>

      {typeof props.rejected_reason === "string" && props.rejected_reason.length > 0 && (
        <Text style={styles.rejectedText}>
          <Text style={styles.infoLabel}>Причина отмены: </Text>
          {props.rejected_reason}
        </Text>
      )}

      {props.status !== "completed" &&
        !CANCELLED_STATUSES.includes(props.status) &&
        typeof props.id === "number" &&
        props.id > 0 && <CancelOrderModal id={props.id} navigation={props.navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
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
  statusBadgeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  rejectedText: {
    fontSize: 14,
    color: "#242424",
  },
  readyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#22c55e14",
    borderWidth: 1,
    borderColor: "#22c55e30",
  },
  readyIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  readyIconText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 15,
  },
  readyTextWrap: {
    flex: 1,
    rowGap: 4,
  },
  readyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#15803d",
  },
  readyBody: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
  },
});
