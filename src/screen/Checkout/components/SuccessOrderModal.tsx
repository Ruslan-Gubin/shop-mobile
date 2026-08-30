import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import type { OrderModel } from "../../../shared/types/order";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  active: boolean;
  orderData: OrderModel | null;
  total: number;
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

  return (
    <BaseModal
      visible={props.active}
      onClose={props.onClose}
      title="Заказ успешно оформлен!"
      subtitleText={`Номер заказа: ${orderNumber}`}
      footerAction={{
        cancel: {
          text: "Продолжить покупки",
          action: props.onClose,
          backgroundColor: "#f6f6f9",
        },
        submit: {
          text: "На главную",
          action: handleGoHome,
          backgroundColor: "#a73afd",
        },
      }}
    >
      <Text style={styles.label}>Способ получения</Text>
      <Text style={styles.value}>{receiptLabel}</Text>
      <Text style={styles.label}>Оплата</Text>
      <Text style={styles.value}>{paymentLabel}</Text>
      <Text style={styles.label}>Итого</Text>
      <Text style={styles.value}>{formatterRub.format(props.total)}</Text>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: "#8a8999",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    paddingBottom: 8,
  },
});

