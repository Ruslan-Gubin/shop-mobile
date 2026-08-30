import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { calcBasketInfo } from "../../../shared/helpers/calcBasketInfo";
import { formatterRub } from "../../../shared/helpers/formatters";
import { getDateFromAndDateTo } from "../../../shared/helpers/getDateFromAndDateTo";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { getOrderAddress } from "../../../shared/helpers/getOrderAddress";
import type { CartDiscountModel } from "../../../shared/types/cart-discount";
import type { OrderModel } from "../../../shared/types/order";
import type { ProductModel } from "../../../shared/types/products";
import type { PromotionModel } from "../../../shared/types/promotion";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import { checkoutStore } from "../../../store/checkout/store";
import type { AddressItem } from "../../../store/checkout/types";
import { StockWarningModal } from "../../Basket/components/StockWarningModal";
import { SuccessOrderModal } from "./SuccessOrderModal";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Checkout">;
  basketProducts: ProductModel[];
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
};

type CreateOrderPayload = {
  payment_method: "cash" | "card";
  date_from: Date;
  date_to: Date;
  method_receipt: "pickup" | "courier";
  comment: string;
  phone: string;
  phoneCode: string;
  recipient_name: string;
  address: AddressItem | null;
  products: { product_id: number; quantity: number }[];
};

export const CheckoutFooter = (props: Props) => {
  const selected = basketStore((store) => store.selected);
  const basket = basketStore((store) => store.items);
  const payment_method = checkoutStore((store) => store.payment_method);
  const delivery_date = checkoutStore((store) => store.delivery_date);
  const delivery_time = checkoutStore((store) => store.delivery_time);
  const method_receipt = checkoutStore((store) => store.method_receipt);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);
  const comment = checkoutStore((store) => store.comment);
  const recipient_name = checkoutStore((store) => store.recipient_name);
  const phone = checkoutStore((store) => store.phone);

  const [stocksWarning, setStocksWarning] = useState<
    { product_id: number; available: number; name: string }[]
  >([]);
  const [successOrder, setSuccessOrder] = useState<{
    isOpen: boolean;
    orderData: OrderModel | null;
  }>({ isOpen: false, orderData: null });

  const orderInfo = useMemo(
    () =>
      calcBasketInfo(selected, basket, props.basketProducts, props.cartDiscounts, props.promotions),
    [selected, basket, props.basketProducts, props.cartDiscounts, props.promotions],
  );

  const delivery_price = method_receipt === "courier" ? 100 : 0;

  const address = getOrderAddress(
    props.defaultCenter,
    props.pickupAddress,
    courierAddress,
    method_receipt,
    activePickup,
    activeCourier,
  );

  const disabledSubmit = orderInfo.total === 0 || address === null;

  const createOrder = (selectedProducts: { product_id: number; quantity: number }[]) => {
    const { date_from, date_to } = getDateFromAndDateTo(delivery_date, delivery_time, 10, 19);

    const payload: CreateOrderPayload = {
      payment_method,
      date_from,
      date_to,
      method_receipt,
      comment,
      phone: phone.replace(/\D/g, ""),
      phoneCode: phone ? "+7" : "",
      recipient_name,
      address,
      products: selectedProducts,
    };

    fetchService
      .post<OrderModel>({ url: "orders/create", payload })
      .then((response) => {
        if (response.status === "success" && response.data) {
          for (let i = 0; i < selectedProducts.length; i++) {
            basketAdapter.delete(selectedProducts[i].product_id);
          }

          checkoutAdapter.changeAdditionalInfoInputs("", "recipient_name");
          checkoutAdapter.changeAdditionalInfoInputs("", "comment");
          checkoutAdapter.changeAdditionalInfoInputs("", "phone");

          setSuccessOrder({ isOpen: true, orderData: response.data });
        } else {
          let firstError = "";

          response.errors.forEach((error) => {
            if (error.key === "phone") {
              checkoutAdapter.activeErrorAdditionalInfoInputs(error.message, "phone_error");
              firstError = error.message;
            }
            if (error.key === "comment") {
              checkoutAdapter.activeErrorAdditionalInfoInputs(error.message, "comment_error");
              firstError = error.message;
            }
            if (error.key === "recipient_name") {
              checkoutAdapter.activeErrorAdditionalInfoInputs(
                error.message,
                "recipient_name_error",
              );
              firstError = error.message;
            }
          });

          const message = firstError || response.message || "Не удалось создать заказ";

          Alert.alert("Ошибка", message, [{ text: "ОК", style: "default" }]);
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось создать заказ");

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => createOrder(selectedProducts),
          },
        ]);
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

    fetchService
      .post<{ product_id: number; available: number }[]>({
        url: "product-stock/checking-balances",
        payload: selectedProducts,
      })
      .then((response) => {
        if (
          response.status === "success" &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const updateStocksWarning = [];

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
          createOrder(selectedProducts);
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

  const total = orderInfo.total + delivery_price;

  return (
    <>
      <SuccessOrderModal
        navigation={props.navigation}
        active={successOrder.isOpen}
        orderData={successOrder.orderData}
        total={total}
        onClose={() => setSuccessOrder({ isOpen: false, orderData: null })}
      />
      <StockWarningModal
        navigation={props.navigation}
        type={"checkout"}
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
            Оформить
          </Text>

          {!disabledSubmit && (
            <Text
              style={[
                styles.footerButtonText,
                !disabledSubmit && styles.footerButtonTextActiveTotal,
              ]}
            >
              {formatterRub.format(total)}
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
  discountText: {
    textDecorationLine: "line-through",
    fontSize: 11,
    color: "white",
    fontWeight: 600,
  },
});
