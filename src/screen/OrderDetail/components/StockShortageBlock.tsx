import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { OrderProductModel, OrderStockShortageItem } from "../../../shared/types/order";
import { StockShortageModal } from "./StockShortageModal";

type Props = {
  order_id: number;
  items: OrderStockShortageItem[];
  products: OrderProductModel[];
  loading: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const StockShortageBlock = (props: Props) => {
  const [open, setOpen] = useState(false);

  const noProductsLeft =
    props.products.length > 0 &&
    props.products.every((product) => {
      const shortage = props.items.find((item) => item.id === product.id);

      return typeof shortage === "object" && shortage !== null && shortage.quantity === 0;
    });

  return (
    <>
      <View style={styles.block}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>!</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Проблема с остатками</Text>
            <Text>
              {noProductsLeft
                ? "Все товары из заказа закончились на складе"
                : "Некоторые товары требуют уточнения"}
            </Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>
            {noProductsLeft ? "Отменить заказ" : "Решить проблему"}
          </Text>
        </Pressable>
      </View>

      <StockShortageModal
        visible={open}
        onClose={() => setOpen(false)}
        order_id={props.order_id}
        items={props.items}
        products={props.products}
        noProductsLeft={noProductsLeft}
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
    fontSize: 16,
    fontWeight: "600",
    color: "#242424",
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
    fontWeight: "600",
    color: "#ffffff",
  },
});

