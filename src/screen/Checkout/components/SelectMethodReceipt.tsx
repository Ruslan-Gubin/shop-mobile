import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import { DeliveryCourierSvg } from "../../../shared/svg/DeliveryCourierSvg";
import { DeliveryPickupSvg } from "../../../shared/svg/DeliveryPickupSvg";
import { checkoutAdapter } from "../../../store/checkout/adapter";

type Props = {
  method_receipt: "pickup" | "courier";
  isDeliveryCourier: boolean;
  minOrderSum: number;
};

export const SelectMethodReceipt = (props: Props) => {
  const handleChangeMethod = (value: "pickup" | "courier") => {
    checkoutAdapter.setMethodReceipt(value);
  };

  const isActivePickup = props.method_receipt === "pickup" || !props.isDeliveryCourier;
  const isActiveCourier = props.method_receipt === "courier";

  return (
    <View style={styles.methodList}>
      <Pressable
        style={[styles.methodItem, isActivePickup && styles.methodItemActive]}
        onPress={() => handleChangeMethod("pickup")}
      >
        <View style={styles.methodDescription}>
          <View style={styles.titleLine}>
            <DeliveryPickupSvg fill={isActivePickup ? "#ffcb54" : "#727272"} />
            <Text style={styles.title}>Самовывоз</Text>
          </View>
          <Text style={[styles.subTitle, isActivePickup && styles.subTitleActive]}>
            Минимальная сумма заказа 0 ₽
          </Text>
        </View>
      </Pressable>

      {props.isDeliveryCourier && (
        <Pressable
          style={[styles.methodItem, isActiveCourier && styles.methodItemActive]}
          onPress={() => handleChangeMethod("courier")}
        >
          <View style={styles.methodDescription}>
            <View style={styles.titleLine}>
              <DeliveryCourierSvg fill={isActiveCourier ? "#ffcb54" : "#727272"} />
              <Text style={styles.title}>Курьером</Text>
            </View>
            {props.minOrderSum > 0 ? (
              <Text style={[styles.subTitle, isActiveCourier && styles.subTitleActive]}>
                Минимальная сумма заказа {formatterRub.format(props.minOrderSum)}
              </Text>
            ) : (
              <Text style={[styles.subTitle, isActiveCourier && styles.subTitleActive]}>
                Минимальная сумма заказа зависит от адреса доставки
              </Text>
            )}
          </View>
        </Pressable>
      )}
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
    minHeight: 68,
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
