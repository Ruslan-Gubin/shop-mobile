import { Pressable, StyleSheet, Text, View } from "react-native";
import { BankCardSvg } from "../../../shared/svg/BankCardSvg";
import { CashSvg } from "../../../shared/svg/CashSvg";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import { checkoutStore } from "../../../store/checkout/store";
import { InfoCard } from "./InfoCard";

export const PaymentMethodCard = () => {
  const payment_method = checkoutStore((store) => store.payment_method);

  return (
    <InfoCard title="Способ оплаты">
      <View style={styles.methodList}>
        <Pressable
          style={[styles.methodItem, payment_method === "cash" && styles.methodItemActive]}
          onPress={() => checkoutAdapter.changePaymentMethod("cash")}
        >
          <CashSvg width={44} height={28} />
          <View style={styles.methodDescription}>
            <Text style={payment_method === "cash" ? styles.methodTitleActive : styles.methodTitle}>
              Наличными
            </Text>
            <Text style={payment_method === "cash" ? styles.methodTextActive : styles.methodText}>
              При получении
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.methodItem, payment_method === "card" && styles.methodItemActive]}
          onPress={() => checkoutAdapter.changePaymentMethod("card")}
        >
          <BankCardSvg width={44} height={28} />
          <View style={styles.methodDescription}>
            <Text style={payment_method === "card" ? styles.methodTitleActive : styles.methodTitle}>
              Банковской картой
            </Text>
            <Text style={payment_method === "card" ? styles.methodTextActive : styles.methodText}>
              Или QR при получении
            </Text>
          </View>
        </Pressable>
      </View>
    </InfoCard>
  );
};

const styles = StyleSheet.create({
  methodList: {
    flexDirection: "row",
    columnGap: 8,
  },
  methodItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f1f1f5",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    rowGap: 8,
    backgroundColor: "#25507e05",
  },
  methodItemActive: {
    borderColor: "#ffcb54",
    backgroundColor: "#fff",
  },
  methodDescription: {
    alignItems: "center",
    rowGap: 2,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#868695",
    textAlign: "center",
  },
  methodTitleActive: {
    fontSize: 13,
    fontWeight: "600",
    color: "#242424",
    textAlign: "center",
  },
  methodText: {
    fontSize: 11,
    color: "#868695",
    textAlign: "center",
  },
  methodTextActive: {
    fontSize: 11,
    color: "#242424",
    textAlign: "center",
  },
});
