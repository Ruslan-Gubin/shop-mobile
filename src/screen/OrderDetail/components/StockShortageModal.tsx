import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTransition } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import type { OrderProductModel, OrderReservation } from "../../../shared/types/order";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  order_id: number;
  products: OrderProductModel[];
  notProductLeft: boolean;
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const StockShortageModal = (props: Props) => {
  const [loading, transition] = useTransition();

  const handleCancelOrder = () => {
    const defaultErrorMessage = "Не удалось отменить заказ";

    transition(() => {
      fetchService
        .patch<null>({
          url: `orders/reject/${props.order_id}`,
          payload: { rejected_reason: "Отменён из-за нехватки товара на складе" },
        })
        .then((response) => {
          if (response.status === "success") {
            props.onClose();
            props.navigation?.reset({ index: 0, routes: [{ name: "Orders" }] });
          } else {
            throw response.message;
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultErrorMessage);

          Alert.alert("Ошибка", message, [
            { text: "Отмена", style: "default" },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                handleCancelOrder();
              },
            },
          ]);
        });
    });
  };

  const handleApply = () => {
    const defaultErrorMessage = "Не удалось применить изменения";

    transition(() => {
      fetchService
        .post<null>({
          url: `orders/accept-shortage/${props.order_id}`,
          payload: {},
        })
        .then((response) => {
          if (response.status === "success") {
            props.onClose();
            props.navigation?.reset({ index: 0, routes: [{ name: "Orders" }] });
          } else {
            throw response.message;
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultErrorMessage);

          Alert.alert("Ошибка", message, [
            { text: "Отмена", style: "default" },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                handleApply();
              },
            },
          ]);
        });
    });
  };

  const getLeftQuantity = (
    needQuantity: number,
    reservations: OrderReservation[],
    shortage_stocks: OrderReservation[],
  ) => {
    let left = needQuantity;

    for (let j = 0; j < reservations.length; j++) {
      const reservation = reservations[j];

      const findShortageStock = shortage_stocks.find(
        (el) =>
          el.stock_id === reservation.stock_id && el.warehouse_id === reservation.warehouse_id,
      );

      if (findShortageStock && reservation.quantity > findShortageStock.quantity) {
        left -= reservation.quantity - findShortageStock.quantity;
      }
    }
    return left;
  };

  return (
    <BaseModal
      visible={props.visible}
      onClose={props.onClose}
      title="Недостаточно товара на складе"
      subtitleText={
        props.notProductLeft
          ? "Все товары из заказа закончились на складе. Вы можете отменить заказ."
          : "Для некоторых товаров не хватает остатков на складе. Примените изменения или отмените заказ."
      }
      footerAction={{
        cancel: {
          text: "Отменить заказ",
          action: handleCancelOrder,
          backgroundColor: "#f6f6f9",
          color: "#cd5c5c",
          disabled: loading,
        },
        ...(!props.notProductLeft && {
          submit: {
            text: "Применить",
            action: handleApply,
            backgroundColor: "#a73afd",
            disabled: loading,
          },
        }),
      }}
    >
      {props.loading && (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="small" color="#a73afd" />
        </View>
      )}

      {!props.loading && (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {props.products.map((product) => {
            const left = getLeftQuantity(
              product.quantity,
              product.reservations,
              product.shortage_stocks,
            );

            return (
              <View key={product.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  {typeof product.name === "string" && product.name.length > 0 && (
                    <Text numberOfLines={1} style={styles.itemName}>
                      {product.name}
                    </Text>
                  )}
                  <Text style={[styles.stockInfo, left === 0 && styles.stockInfoDanger]}>
                    {`Необходимо: ${product.quantity} шт. - ${
                      left > 0 ? `Доступно: ${left} шт.` : "Нет в наличии"
                    }`}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  list: {
    maxHeight: 510,
    flexGrow: 0,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: {
    rowGap: 4,
  },
  itemCard: {
    rowGap: 8,
    padding: 12,
    backgroundColor: "#f8f8fb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8ee",
  },
  itemHeader: {
    rowGap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  stockInfo: {
    paddingTop: 4,
    fontSize: 13,
    color: "darkorange",
  },
  stockInfoDanger: {
    color: "#cd5c5c",
    fontWeight: "500",
  },
});
