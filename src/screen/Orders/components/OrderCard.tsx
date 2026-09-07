import { StyleSheet, Text, View } from "react-native";
import type { OrderModel } from "../../../shared/types/order";

type Props = {
  order: OrderModel;
};

export const OrderCard = (props: Props) => {
  return (
    <View style={styles.root}>
      {props.order.order_number && <Text>Number# ${props.order.order_number}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 12,
  },
});
