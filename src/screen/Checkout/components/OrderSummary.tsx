import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { calcBasketInfo } from "../../../shared/helpers/calcBasketInfo";
import { formatterRub } from "../../../shared/helpers/formatters";
import { getDeliveryTimeDisplay } from "../../../shared/helpers/getDeliveryTimeDisplay";
import { getOrderAddress } from "../../../shared/helpers/getOrderAddress";
import { getSelectDeliveryDate } from "../../../shared/helpers/getSelectDeliveryDate";
import type { CartDiscountModel } from "../../../shared/types/cart-discount";
import type { ProductModel } from "../../../shared/types/products";
import type { PromotionModel } from "../../../shared/types/promotion";
import { basketStore } from "../../../store/basket/store";
import { checkoutStore } from "../../../store/checkout/store";
import type { AddressItem } from "../../../store/checkout/types";

type Props = {
  basketProducts: ProductModel[];
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
};

export const OrderSummary = (props: Props) => {
  const selected = basketStore((store) => store.selected);
  const basket = basketStore((store) => store.items);
  const payment_method = checkoutStore((store) => store.payment_method);
  const delivery_date = checkoutStore((store) => store.delivery_date);
  const delivery_time = checkoutStore((store) => store.delivery_time);
  const method_receipt = checkoutStore((store) => store.method_receipt);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);

  const orderInfo = useMemo(
    () =>
      calcBasketInfo(selected, basket, props.basketProducts, props.cartDiscounts, props.promotions),
    [selected, basket, props.basketProducts, props.cartDiscounts, props.promotions],
  );

  const delivery_price = method_receipt === "courier" ? 100 : 0;
  const selectDeliveryDate = getSelectDeliveryDate(delivery_date);
  const deliveryTimeDisplay = getDeliveryTimeDisplay(delivery_date, delivery_time, 10, 19);

  const address = getOrderAddress(
    props.defaultCenter,
    props.pickupAddress,
    courierAddress,
    method_receipt,
    activePickup,
    activeCourier,
  );

  const dateFormatter = new Intl.DateTimeFormat("ru", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });

  return (
    <View style={styles.root}>
      <View style={styles.headerLine}>
        <Text style={styles.totalText}>Ваш заказ</Text>
        <Text style={styles.totalText}>
          {formatterRub.format(orderInfo.total + delivery_price)}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.line}>
          <Text style={styles.textInfo}>Товары, {orderInfo.productCount} шт.</Text>
          <Text style={styles.textInfo}>
            {orderInfo.total > 0
              ? formatterRub.format(orderInfo.total + orderInfo.totalDiscount)
              : ""}
          </Text>
        </View>

        {orderInfo.quantityDiscount > 0 && (
          <View style={styles.line}>
            <Text style={styles.textInfo}>Скидка за количество</Text>
            <Text style={styles.textInfo}>- {formatterRub.format(orderInfo.quantityDiscount)}</Text>
          </View>
        )}

        {orderInfo.cartDiscount > 0 && (
          <View style={styles.line}>
            <Text style={styles.textInfo}>{orderInfo.cartDiscountName || "Скидка на корзину"}</Text>
            <Text style={styles.textInfo}>- {formatterRub.format(orderInfo.cartDiscount)}</Text>
          </View>
        )}

        {orderInfo.promotionDiscount > 0 && (
          <View style={styles.line}>
            <Text style={styles.textInfo}>
              {orderInfo.promotionName ? `Акция «${orderInfo.promotionName}»` : "Акция"}
            </Text>
            <Text style={styles.textInfo}>
              - {formatterRub.format(orderInfo.promotionDiscount)}
            </Text>
          </View>
        )}

        <View style={styles.line}>
          <Text style={styles.textInfo}>Стоимость доставки</Text>
          <Text style={styles.textInfo}>{formatterRub.format(delivery_price)}</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.textInfo}>Способ оплаты</Text>
          <Text style={styles.textInfo}>
            {payment_method === "cash" ? "Наличными" : "Банковской картой"}
          </Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.textInfo}>Способ получения</Text>
          <Text style={styles.textInfo}>
            {method_receipt === "courier" ? "Курьером" : "Самовывоз"}
          </Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.textInfo}>Адрес</Text>
          <Text style={styles.textInfo}>{address ? address.name : "не выбран"}</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.textInfo}>
            {method_receipt === "courier" ? "Привезет курьер" : "Выдача заказа"}
          </Text>
          <Text style={styles.textInfo}>{dateFormatter.format(new Date(selectDeliveryDate))}</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.textInfo}>Время</Text>
          <Text style={styles.textInfo}>{deliveryTimeDisplay}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    rowGap: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
  },
  totalText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#242424",
  },
  headerLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    rowGap: 8,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  textInfo: {
    fontSize: 13,
    color: "#242424",
  },
});

