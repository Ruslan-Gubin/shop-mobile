import { Pressable, StyleSheet, Text, View } from "react-native";
import { DeliveryCourierSvg } from "../../../shared/svg/DeliveryCourierSvg";
import { DeliveryPickupSvg } from "../../../shared/svg/DeliveryPickupSvg";
import { checkoutAdapter } from "../../../store/checkout/adapter";

type Props = {
  method_receipt: "pickup" | "courier";
};

export const SelectMethodReceipt = ({ method_receipt }: Props) => {
  const handleChangeMethod = (value: "pickup" | "courier") => {
    checkoutAdapter.setMethodReceipt(value);
  };

  return (
    <View style={styles.methodList}>
      <Pressable
        style={[styles.methodItem, method_receipt === "pickup" && styles.methodItemActive]}
        onPress={() => handleChangeMethod("pickup")}
      >
        <View style={styles.methodDescription}>
          <View style={styles.titleLine}>
            <DeliveryPickupSvg fill={method_receipt === "pickup" ? "#ffcb54" : "#727272"} />
            <Text style={styles.title}>Самовывоз</Text>
          </View>
          <Text style={[styles.subTitle, method_receipt === "pickup" && styles.subTitleActive]}>
            Минимальная сумма заказа 0 ₽
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.methodItem, method_receipt === "courier" && styles.methodItemActive]}
        onPress={() => handleChangeMethod("courier")}
      >
        <View style={styles.methodDescription}>
          <View style={styles.titleLine}>
            <DeliveryCourierSvg fill={method_receipt === "courier" ? "#ffcb54" : "#727272"} />
            <Text style={styles.title}>Курьером</Text>
          </View>
          <Text style={[styles.subTitle, method_receipt === "courier" && styles.subTitleActive]}>
            Минимальная сумма заказа 5000 ₽
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  methodList: {
    rowGap: 8,
  },
  methodItem: {
    borderWidth: 1,
    borderColor: "#f1f1f5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#25507e05",
  },
  methodItemActive: {
    borderColor: "#ffcb54",
    backgroundColor: "#fff",
  },
  methodDescription: {
    rowGap: 4,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#242424",
  },
  subTitle: {
    fontSize: 12,
    color: "#868695",
  },
  subTitleActive: {
    color: "#242424",
  },
});