import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { basketAdapter } from "../../../store/basket/adapter";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  basket: Record<string, number>;
  active: boolean;
  onClose: () => void;
  items: { product_id: number; available: number; name: string }[];
  onSubmit: () => void;
  disabled: boolean;
  type: "checkout" | "basket";
  navigation: NativeStackNavigationProp<ParamListBase, string>;
};

export const StockWarningModal = (props: Props) => {
  const handleSubmit = () => {
    props.onClose();
    props.onSubmit();
  };

  const handleRouter = () => {
    props.onClose();
    props.navigation.push("Basket");
  };

  const handleChangeQuantity = (product_id: number, quantity: number) => {
    basketAdapter.setQuantity(product_id, quantity);
  };

  const handleDeleteItem = (product_id: number) => {
    basketAdapter.delete(product_id);
  };

  const getHasWarning = () => {
    let result = false;

    for (let i = 0; i < props.items.length; i++) {
      const item = props.items[i];
      const need = props.basket[item.product_id];
      if (
        (typeof need === "number" && item.available !== need) ||
        (item.available === 0 && need > 0)
      ) {
        result = true;
        break;
      }
    }

    return result;
  };

  const hasWarning = getHasWarning();

  return (
    <BaseModal
      visible={props.active}
      onClose={props.onClose}
      title="Недостаточно товара на складе"
      subtitleText="Для некоторых товаров не хватает остатков на складе. Выберите действие для каждого:"
      footerAction={{
        cancel: {
          text: props.type === "basket" ? "Отмена" : "Вернуться в корзину",
          action: props.type === "basket" ? props.onClose : handleRouter,
          backgroundColor: "#f6f6f9",
        },
        submit: {
          text: "Продолжить",
          action: handleSubmit,
          disabled: props.disabled || hasWarning,
          backgroundColor: "#a73afd",
        },
      }}
    >
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {props.items.map((item) => (
          <View key={item.product_id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text>{item.name}</Text>

              {typeof props.basket[item.product_id] === "number" &&
                item.available !== props.basket[item.product_id] && (
                  <Text style={styles.stockInfo}>
                    Необходимо: {props.basket[item.product_id]} шт.{" - "}
                    {item.available > 0 ? `Доступно: ${item.available} шт.` : "Нет в наличии"}
                  </Text>
                )}

              {item.available === props.basket[item.product_id] && (
                <Text style={[styles.stockInfo, styles.stockInfoSuccess]}>
                  {`Изменено количество на ${props.basket[item.product_id]} шт.`}
                </Text>
              )}

              {!props.basket[item.product_id] && (
                <Text
                  style={[styles.stockInfo, styles.stockInfoSuccess]}
                >{`Товар удален из корзины`}</Text>
              )}
            </View>

            {props.basket[item.product_id] > 0 &&
              props.basket[item.product_id] !== item.available && (
                <View style={styles.actions}>
                  {item.available > 0 && (
                    <Pressable
                      onPress={() => handleChangeQuantity(item.product_id, item.available)}
                    >
                      <Text style={styles.buttonLinkText}>Взять {item.available || 5} шт.</Text>
                    </Pressable>
                  )}

                  {
                    <Pressable onPress={() => handleDeleteItem(item.product_id)}>
                      <Text style={styles.buttonLinkDeleteText}>Убрать товар</Text>
                    </Pressable>
                  }
                </View>
              )}
          </View>
        ))}
      </ScrollView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
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
  stockInfo: {
    fontSize: 13,
    color: "#8a8999",
  },
  stockInfoSuccess: {
    paddingTop: 8,
    color: "#38a169",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  buttonLinkText: {
    fontSize: 12,
    color: "#a73afd",
  },
  buttonLinkDeleteText: {
    fontSize: 12,
    color: "indianred",
  },
});
