import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import type { OrderStatus } from "../../../shared/types/order";
import type { PhotoModel } from "../../../shared/types/photo";
import { ImageMain } from "../../../shared/ui/image/ImageMain";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";

type Props = {
  name: string;
  price: number;
  quantity: number;
  description: string;
  photos: PhotoModel[];
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  product_id: number;
  order_status: OrderStatus;
};

export const OrderProductCard = (props: Props) => {
  const isInBasket =
    typeof basketStore((store) => store.items[String(props.product_id)]) === "number";

  const handleAddToBasket = () => {
    basketAdapter.add(props.product_id);
  };

  return (
    <View style={styles.content}>
      <Pressable
        onPress={() =>
          typeof props.product_id === "number" &&
          props.product_id > 0 &&
          props.navigation?.push("ProductInfo", { id: props.product_id })
        }
      >
        <ImageMain uri={props.photos?.[0]?.url || ""} style={styles.image} />
      </Pressable>

      <View style={styles.productInfo}>
        {props.price > 0 && (
          <Text style={styles.productPrice}>Цена: {formatterRub.format(props.price)}</Text>
        )}
        {props.quantity > 0 && (
          <Text style={styles.productPrice}>Количество: {props.quantity} шт.</Text>
        )}
        {props.name.length > 0 && (
          <Text numberOfLines={1} style={styles.productName}>
            {props.name}
          </Text>
        )}
        {props.description.length > 0 && (
          <Text numberOfLines={2} style={styles.productDescription}>
            {props.description}
          </Text>
        )}

        <View style={styles.actions}>
          {!isInBasket && (
            <Pressable style={styles.addButton} onPress={handleAddToBasket}>
              <Text style={styles.addButtonText}>Добавить в корзину</Text>
            </Pressable>
          )}

          {props.order_status === "completed" && (
            <Pressable
              style={styles.reviewButton}
              onPress={() => props.navigation?.push("ReviewsScreen", { id: props.product_id })}
            >
              <Text style={styles.reviewButtonText}>Оценить</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    columnGap: 12,
    alignItems: "flex-start",
    paddingBottom: 12,
  },
  image: {
    width: 72,
    height: 96,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    rowGap: 2,
    minWidth: 0,
    overflow: "hidden",
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: "#242424",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#242424",
  },
  productDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#868695",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 12,
    marginTop: 6,
  },
  reviewButton: {
    justifyContent: "center",

    alignSelf: "flex-start",
  },
  reviewButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#a73afd",
  },
  addButton: {
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#a73afd",
  },
});
