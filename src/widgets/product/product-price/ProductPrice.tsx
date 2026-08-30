import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import { getCurrentPrice } from "../../../shared/helpers/getCurrentPrice";
import { CartPriceSvg } from "../../../shared/svg/CartPriceSvg";
import { basketStore } from "../../../store/basket/store";

type Props = {
  product_id: number;
  priceList: { price: number; minQuantity: number }[];
};

export const ProductPrice = (props: Props) => {
  const count = basketStore((state) => state.items[props.product_id]) || 1;

  const currentPrice = useMemo(
    () => getCurrentPrice(count || 1, props.priceList),
    [props.priceList, count],
  );

  return (
    <View style={styles.priceLine}>
      {currentPrice > 0 && (
        <View style={styles.priceContainer}>
          <CartPriceSvg fill="#10c10c" size={16} />
          <Text style={styles.price}>{formatterRub.format(currentPrice * count)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  priceLine: {},
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 500,
    color: "#10c10c",
  },
});
