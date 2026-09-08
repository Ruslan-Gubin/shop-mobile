import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import type { OrderProductModel, OrderStockShortageItem } from "../../../shared/types/order";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  order_id: number;
  items: OrderStockShortageItem[];
  products: OrderProductModel[];
  noProductsLeft: boolean;
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const StockShortageModal = (props: Props) => {
  const [submitting, setSubmitting] = useState(false);

  const handleCancelOrder = () => {
    setSubmitting(true);
    const defaultErrorMessage = "Не удалось отменить заказ";

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
      })
      .finally(() => setSubmitting(false));
  };

  const handleApply = () => {
    setSubmitting(true);
    const defaultErrorMessage = "Не удалось применить изменения";

    fetchService
      .post<null>({
        url: `orders/${props.order_id}/apply-stock-changes`,
        payload: { stocks: props.items },
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
      })
      .finally(() => setSubmitting(false));
  };

  const disabled = submitting;

  return (
    <BaseModal
      visible={props.visible}
      onClose={props.onClose}
      title="Недостаточно товара на складе"
      subtitleText={
        props.noProductsLeft
          ? "Все товары из заказа закончились на складе. Вы можете отменить заказ."
          : "Для некоторых товаров не хватает остатков на складе. Примените изменения или отмените заказ."
      }
      footerAction={{
        cancel: {
          text: "Отменить заказ",
          action: handleCancelOrder,
          backgroundColor: "#f6f6f9",
          color: "#cd5c5c",
          disabled,
        },
        ...(!props.noProductsLeft && {
          submit: {
            text: "Применить",
            action: handleApply,
            backgroundColor: "#a73afd",
            disabled,
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
          {props.items.map((item) => {
            const product = props.products.find((el) => el.id === item.id);

            if (!product) {
              return null;
            }

            const need = product.quantity;
            const available = item.quantity;

            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  {typeof product.name === "string" && product.name.length > 0 && (
                    <Text numberOfLines={1} style={styles.itemName}>
                      {product.name}
                    </Text>
                  )}
                  <Text style={[styles.stockInfo, available === 0 && styles.stockInfoDanger]}>
                    {`Необходимо: ${need} шт. - ${
                      available > 0 ? `Доступно: ${available} шт.` : "Нет в наличии"
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

