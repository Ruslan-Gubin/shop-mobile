import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { calcBasketInfo } from "../../../shared/helpers/calcBasketInfo";
import { formatterRub } from "../../../shared/helpers/formatters";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import type { CartDiscountModel } from "../../../shared/types/cart-discount";
import type { ProductModel } from "../../../shared/types/products";
import type { PromotionModel } from "../../../shared/types/promotion";
import { basketStore } from "../../../store/basket/store";
import { StockWarningModal } from "./StockWarningModal";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Basket">;
  basketProducts: ProductModel[];
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
};

export const BasketFooter = (props: Props) => {
  const selected = basketStore((store) => store.selected);
  const basket = basketStore((store) => store.items);
  const [stocksWarning, setStocksWarning] = useState<
    { product_id: number; available: number; name: string }[]
  >([]);

  const orderInfo = useMemo(
    () =>
      calcBasketInfo(selected, basket, props.basketProducts, props.cartDiscounts, props.promotions),
    [selected, basket, props.basketProducts, props.cartDiscounts, props.promotions],
  );

  const disabledSubmit = orderInfo.total === 0;

  const fetchCheckingBalance = (selectedProducts: { product_id: number; quantity: number }[]) => {
    return fetchService.post<{ product_id: number; available: number }[]>({
      url: "product-stock/checking-balances",
      payload: selectedProducts,
    });
  };

  const handleSubmitOrder = () => {
    const selectedProducts: { product_id: number; quantity: number }[] = [];

    for (const key in basket) {
      if (selected.includes(Number(key)) && basket[key] > 0) {
        selectedProducts.push({ product_id: Number(key), quantity: basket[key] });
      }
    }

    const defaultErrorMessage = "Не удалось проверить наличии товаров на складах";
    console.log(selectedProducts);
    fetchCheckingBalance(selectedProducts)
      .then((response) => {
        if (
          response.status === "success" &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const updateStocksWarning = [];
          updateStocksWarning.push({ product_id: 300, quantity: 50, name: "Item 1" });
          updateStocksWarning.push({ product_id: 301, quantity: 50, name: "Item 2" });
          updateStocksWarning.push({ product_id: 303, quantity: 50, name: "Item 3" });
          updateStocksWarning.push({ product_id: 304, quantity: 50, name: "Item 4" });
          updateStocksWarning.push({ product_id: 305, quantity: 50, name: "Item 5" });
          updateStocksWarning.push({ product_id: 306, quantity: 50, name: "Item 6" });
          updateStocksWarning.push({ product_id: 307, quantity: 50, name: "Item 7" });

          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i];

            const findProduct = props.basketProducts.find(
              (product) => product.id === item.product_id,
            );

            updateStocksWarning.push({
              available: item.available,
              product_id: item.product_id,
              name: findProduct?.name || "",
            });
          }

          setStocksWarning(updateStocksWarning);
        } else if (
          response.status === "success" &&
          Array.isArray(response.data) &&
          response.data.length === 0
        ) {
          props?.navigation?.push("Checkout");
        } else if (response.status === "error") {
          throw response.message || defaultErrorMessage;
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
              handleSubmitOrder();
            },
          },
        ]);
      });
  };

  return (
    <>
      <StockWarningModal
        navigation={props.navigation}
        type={"basket"}
        disabled={orderInfo.total === 0}
        basket={basket}
        active={stocksWarning.length > 0}
        items={stocksWarning}
        onClose={() => setStocksWarning([])}
        onSubmit={handleSubmitOrder}
      />
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
              style={[
                styles.footerButtonText,
                !disabledSubmit && styles.footerButtonTextActiveTotal,
              ]}
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
    </>
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
