import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import type { OrderModel } from "../../../shared/types/order";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  active: boolean;
  orderData: OrderModel | null;
  total: number;
  addressName: string;
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  onClose: () => void;
};

export const SuccessOrderModal = (props: Props) => {
  const orderNumber = props.orderData?.order_number ?? `#${props.orderData?.id ?? "—"}`;
  const paymentLabel =
    props.orderData?.payment_method === "card" ? "Банковской картой" : "Наличными";
  const receiptLabel = props.orderData?.method_receipt === "courier" ? "Курьер" : "Самовывоз";

  const handleGoHome = () => {
    props.onClose();
    props.navigation.navigate("HomeStack");
  };

  const handleGoToOrder = () => {
    props.onClose();
    if (props.orderData?.id != null) {
      props.navigation.navigate("OrderDetail", { id: props.orderData.id });
    }
  };

  return (
    <BaseModal
      visible={props.active}
      onClose={props.onClose}
      title="Заказ успешно оформлен!"
      footerAction={{
        cancel: {
          text: "На главную",
          action: handleGoHome,
          backgroundColor: "#f6f6f9",
        },
        submit: {
          text: "Перейти к заказу",
          action: handleGoToOrder,
          backgroundColor: "#a73afd",
        },
      }}
    >
      <View>
        {orderNumber.length > 0 && <Text style={styles.label}>Номер заказа:</Text>}
        {orderNumber.length > 0 && <Text style={styles.value}>{orderNumber}</Text>}
        {receiptLabel.length > 0 && <Text style={styles.label}>Способ получения</Text>}
        {receiptLabel.length > 0 && <Text style={styles.value}>{receiptLabel}</Text>}
        {props.addressName.length > 0 && <Text style={styles.label}>Адрес</Text>}
        {props.addressName.length > 0 && <Text style={styles.value}>{props.addressName}</Text>}
        {paymentLabel.length > 0 && <Text style={styles.label}>Оплата</Text>}
        {paymentLabel.length > 0 && <Text style={styles.value}>{paymentLabel}</Text>}
        {props.total > 0 && <Text style={styles.label}>Итого</Text>}
        {props.total > 0 && <Text style={styles.value}>{formatterRub.format(props.total)}</Text>}
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    paddingBottom: 8,
  },
});
