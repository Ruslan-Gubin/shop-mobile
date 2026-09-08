import { StyleSheet, Text, View } from "react-native";
import { formatDateRu } from "../../../shared/helpers/formatters";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../shared/helpers/orderStatus";
import type { OrderStatus } from "../../../shared/types/order";

type Props = {
  status: OrderStatus;
  created_at: Date | null;
  rejected_reason: string;
};

export const MainInfo = (props: Props) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderNumber}>Статус</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: `${getOrderStatusColor(props.status)}18`,
              borderColor: `${getOrderStatusColor(props.status)}40`,
            },
          ]}
        >
          <Text style={[styles.statusBadgeText, { color: getOrderStatusColor(props.status) }]}>
            {getOrderStatusLabel(props.status)}
          </Text>
        </View>
      </View>

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
  rejectedText: {
    fontSize: 14,
    color: "#242424",
  },
});
