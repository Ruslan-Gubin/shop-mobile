import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { OrderPriceChangeItem, OrderProductModel } from "../../../shared/types/order";
import { PriceChangeModal } from "./PriceChangeModal";

type Props = {
  order_id: number;
  items: OrderPriceChangeItem[];
  products: OrderProductModel[];
  loading: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const PriceChangeBlock = (props: Props) => {
  const [open, setOpen] = useState(false);

  const allRemoved =
    props.products.length > 0 &&
    props.products.every((product) => {
      const change = props.items.find((item) => item.id === product.product_id);

      return typeof change === "object" && change !== null && change.price === 0;
    });

  return (
    <>
      <View style={styles.block}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>%</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Цены изменились</Text>
            <Text style={styles.subtitle}>
              {allRemoved
                ? "Все товары из заказа удаляются из-за изменения цен"
                : "Некоторые товары изменили цену"}
            </Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>{allRemoved ? "Отменить заказ" : "Решить проблему"}</Text>
        </Pressable>
      </View>

      <PriceChangeModal
        visible={open}
        onClose={() => setOpen(false)}
        order_id={props.order_id}
        items={props.items}
        products={props.products}
        allRemoved={allRemoved}
        loading={props.loading}
        navigation={props.navigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  block: {
    rowGap: 12,
    padding: 12,
    backgroundColor: "#fff8e1",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffc107",
    marginHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#ffc107",
  },
  icon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242424",
  },
  headerText: {
    flex: 1,
    rowGap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#242424",
  },
  subtitle: {
    fontSize: 13,
    color: "#8a8999",
  },
  button: {
    alignSelf: "flex-start",
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#a73afd",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
});