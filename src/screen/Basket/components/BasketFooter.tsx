import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { calcBasketInfo } from "../../../shared/helpers/calcBasketInfo";
import { formatterRub } from "../../../shared/helpers/formatters";
import type { CartDiscountModel } from "../../../shared/types/cart-discount";
import type { ProductModel } from "../../../shared/types/products";
import type { PromotionModel } from "../../../shared/types/promotion";
import { basketStore } from "../../../store/basket/store";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Basket">;
  basketProducts: ProductModel[];
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
};

export const BasketFooter = (props: Props) => {
  const selected = basketStore((store) => store.selected);
  const basket = basketStore((store) => store.items);

  const orderInfo = useMemo(
    () =>
      calcBasketInfo(selected, basket, props.basketProducts, props.cartDiscounts, props.promotions),
    [selected, basket, props.basketProducts, props.cartDiscounts, props.promotions],
  );

  const disabledSubmit = orderInfo.total === 0;

  const handleSubmitOrder = () => {
    const selectedProducts: { product_id: number; quantity: number }[] = [];

    for (const key in basket) {
      if (selected.includes(Number(key)) && basket[key] > 0) {
        selectedProducts.push({ product_id: Number(key), quantity: basket[key] });
      }
    }
    console.log(selectedProducts);
    // props?.navigation.push("Checkout")

    // props.checkingBalanceAction(selectedProducts).then((response) => {
    //   if (Array.isArray(response.data) && response.data.length > 0) {
    //     setStocksWarning(
    //       response.data.map((el) => ({
    //         ...el,
    //         name: `product name: ${el.product_id}`,
    //       })),
    //     );
    //   } else if (Array.isArray(response.data) && response.data.length === 0) {
    //     if (props.type === "basket") {
    //       router.push("/checkout");
    //     } else {
    //       createOrder(selectedProducts);
    //     }
    //   }
    // });
  };

  return (
    <View style={styles.footer}>
      <Pressable
        disabled={disabledSubmit}
        onPress={handleSubmitOrder}
        style={[styles.footerButton, !disabledSubmit && styles.footerButtonActive]}
      >
        <Text style={[styles.footerButtonText, !disabledSubmit && styles.footerButtonTextActive]}>
          {disabledSubmit ? "Выберите товары" : `К оформлению: ${orderInfo.productCount || ""}`}
        </Text>

        {!disabledSubmit && (
          <Text
            style={[styles.footerButtonText, !disabledSubmit && styles.footerButtonTextActiveTotal]}
          >
            {formatterRub.format(orderInfo.total)}
            {orderInfo.totalDiscount > 0 && (
              <>
                {"  "}
                <Text style={styles.discountText}>
                  {formatterRub.format(orderInfo.totalDiscount + orderInfo.total)}
                </Text>
              </>
            )}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingBlock: 8,
    paddingInline: 6,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    backgroundColor: "white",
  },
  footerButton: {
    backgroundColor: "#f6f6f9",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  footerButtonActive: {
    backgroundColor: "#f86c25",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingInline: 12,
  },
  footerButtonText: {
    color: "#d2d2e0",
    fontWeight: 600,
  },
  footerButtonTextActive: {
    color: "white",
    fontSize: 13,
  },
  footerButtonTextActiveTotal: {
    color: "white",
    fontSize: 14,
  },
  discountContainer: {
    paddingLeft: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  discountText: {
    textDecorationLine: "line-through",
    fontSize: 11,
    color: "white",
    fontWeight: 600,
  },
});
