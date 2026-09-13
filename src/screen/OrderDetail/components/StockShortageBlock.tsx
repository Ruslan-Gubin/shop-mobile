import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { OrderProductModel } from "../../../shared/types/order";
import { StockShortageModal } from "./StockShortageModal";

type Props = {
  order_id: number;
  products: OrderProductModel[];
  loading: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const StockShortageBlock = (props: Props) => {
  const [open, setOpen] = useState(false);

  const getProblemProductStocks = (products: OrderProductModel[]) => {
    let left = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      for (let j = 0; j < product.reservations.length; j++) {
        const reservation = product.reservations[j];

        const findShortageStock = product.shortage_stocks.find(
          (el) =>
            el.stock_id === reservation.stock_id && el.warehouse_id === reservation.warehouse_id,
        );

        left +=
          findShortageStock && reservation.quantity > findShortageStock.quantity
            ? findShortageStock.quantity
            : reservation.quantity;
      }
    }

    return left;
  };

  const left = getProblemProductStocks(props.products);
  const notProductLeft = left === 0;

  const problemShortageStocksProducts = props.products.filter(
    (el) => Array.isArray(el.shortage_stocks) && el.shortage_stocks.length > 0,
  );

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
              {notProductLeft
                ? "Все товары из заказа закончились на складе"
                : "Некоторые товары требуют уточнения"}
            </Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>
            {notProductLeft ? "Отменить заказ" : "Решить проблему"}
          </Text>
        </Pressable>
      </View>

      <StockShortageModal
        visible={open}
        onClose={() => setOpen(false)}
        order_id={props.order_id}
        products={problemShortageStocksProducts}
        notProductLeft={notProductLeft}
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
