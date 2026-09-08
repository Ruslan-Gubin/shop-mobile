import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import type { PhotoModel } from "../../../shared/types/photo";
import { ImageMain } from "../../../shared/ui/image/ImageMain";

type Props = {
  name: string;
  price: number;
  quantity: number;
  description: string;
  photos: PhotoModel[];
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  product_id: number;
};

export const OrderProductCard = (props: Props) => {
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
});
