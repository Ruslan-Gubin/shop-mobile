import { StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";

type Props = {
  payment_method: string;
  subtotal: number;
  discount_quantity: number;
  discount_name: string;
  discount_percent: number;
  discount_total: number;
  method_receipt: string;
  total: number;
};

export const DetailPaid = (props: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Оплата</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Способ оплаты</Text>
        <Text style={styles.cardValue}>
          {props.payment_method === "card" ? "Банковской картой" : "Наличными"}
        </Text>
      </View>

      {typeof props.subtotal === "number" && props.subtotal > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Всего на сумму</Text>
          <Text style={styles.totalValue}>{formatterRub.format(props.subtotal)}</Text>
        </View>
      )}

      {typeof props.discount_quantity === "number" && props.discount_quantity > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Скидка за количество</Text>
          <Text style={styles.totalValue}>−{formatterRub.format(props.discount_quantity)}</Text>
        </View>
      )}
      {typeof props.discount_percent === "number" && props.discount_percent > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {props.discount_name ? props.discount_name : "Процент скидки"}
          </Text>
          <Text style={styles.totalValue}>- {props.discount_percent}%</Text>
        </View>
      )}
      {typeof props.discount_total === "number" &&
        typeof props.discount_quantity === "number" &&
        props.discount_total + props.discount_quantity > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Скидка всего</Text>
            <Text style={styles.totalValue}>
              −{formatterRub.format(props.discount_total + props.discount_quantity)}
            </Text>
          </View>
        )}

      {props.method_receipt === "courier" && (
        <View style={styles.totalRow}>
          <Text style={styles.cardLabel}>Стоимость доставки</Text>
          <Text style={styles.cardValue}>{formatterRub.format(100)}</Text>
        </View>
      )}
      <View style={styles.divider} />
      {props.total > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.grandTotal}>Всего</Text>
          <Text style={styles.grandTotal}>{formatterRub.format(props.total)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
