import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { CONFIG_APP } from "../../shared/config/config";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import type { CartDiscountModel } from "../../shared/types/cart-discount";
import type { ProductModel } from "../../shared/types/products";
import type { PromotionModel } from "../../shared/types/promotion";
import type { WarehouseModel } from "../../shared/types/warehouse";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { basketStore } from "../../store/basket/store";
import type { AddressItem } from "../../store/checkout/types";
import { AdditionalInformation } from "./components/AdditionalInformation";
import { CheckoutFooter } from "./components/CheckoutFooter";
import { DeliveryDateCard } from "./components/DeliveryDateCard";
import { MethodReceiptCard } from "./components/MethodReceiptCard";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentMethodCard } from "./components/PaymentMethodCard";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Checkout">;
};

export const CheckoutScreen = (props: Props) => {
  const basket = basketStore((store) => store.items);
  const basketIds = Object.keys(basket).join(",");

  const [basketProducts, setBasketProducts] = useState<ProductModel[]>([]);
  const [cartDiscounts, setCartDiscounts] = useState<CartDiscountModel[]>([]);
  const [promotions, setPromotions] = useState<PromotionModel[]>([]);
  const [pickupAddress, setPickupAddress] = useState<AddressItem[]>([]);
  const [defaultCenter, setDefaultCenter] = useState<{ lng: number; lat: number }>({
    lng: CONFIG_APP.DEFAULT_MAP_CENTER_LNG,
    lat: CONFIG_APP.DEFAULT_MAP_CENTER_LAT,
  });

  const [errors, setErrors] = useState<{
    basket: string;
    discounts: string;
    promotions: string;
    warehouses: string;
  }>({ basket: "", discounts: "", promotions: "", warehouses: "" });
  const [isAgreed, setIsAgreed] = useState(true);

  const updateError = (
    key: "basket" | "discounts" | "promotions" | "warehouses",
    message: string,
  ) => setErrors((prev) => ({ ...prev, [key]: message }));
  const resetError = (key: "basket" | "discounts" | "promotions" | "warehouses") =>
    setErrors((prev) => ({ ...prev, [key]: "" }));

  const fetchWarehouses = useEffectEvent(async () => {
    const defaultErrorMessage = "Не удалось получить список складов";

    await fetchService
      .get<WarehouseModel[]>({ url: "warehouses/public" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          const pickup: AddressItem[] = response.data.reduce<AddressItem[]>(
            (acc, el) => (el.address ? acc.concat(el.address) : acc),
            [],
          );
          const defaultWarehouse = response.data.find((el) => el.default_warehouse);

          setPickupAddress(pickup);
          if (defaultWarehouse?.address) {
            setDefaultCenter({
              lng: defaultWarehouse.address.lng,
              lat: defaultWarehouse.address.lat,
            });
          }
        } else if (response.status === "error") {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        updateError("warehouses", message);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchWarehouses();
              resetError("warehouses");
            },
          },
        ]);
      });
  });

  const fetchBasketEvent = useEffectEvent(async (ids: string) => {
    if (ids.length > 0) {
      const defaultErrorMessage = "Не удалось получить товары корзины";

      await fetchService
        .get<ProductModel[]>({ url: "product/by-ids", params: { ids } })
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setBasketProducts(response.data);
          } else if (response.status === "error") {
            throw response.message || defaultErrorMessage;
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultErrorMessage);
          updateError("basket", message);

          Alert.alert("Ошибка", message, [
            { text: "Отмена", style: "default" },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                fetchBasketEvent(ids);
                resetError("basket");
              },
            },
          ]);
        });
    } else {
      setBasketProducts([]);
    }

    await fetchDiscounts();
    await fetchPromotions();
    await fetchWarehouses();
  });

  const fetchDiscounts = useEffectEvent(async () => {
    const defaultErrorMessage = "Не удалось получить список скидок";

    await fetchService
      .get<CartDiscountModel[]>({ url: "cart-discounts/active" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setCartDiscounts(response.data);
        } else if (response.status === "error") {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        updateError("discounts", message);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchDiscounts();
              resetError("discounts");
            },
          },
        ]);
      });
  });

  const fetchPromotions = useEffectEvent(async () => {
    const defaultErrorMessage = "Не удалось получить список акций";

    await fetchService
      .get<PromotionModel[]>({ url: "promotions/active" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setPromotions(response.data);
        } else if (response.status === "error") {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        updateError("promotions", message);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchPromotions();
              resetError("promotions");
            },
          },
        ]);
      });
  });

  useEffect(() => {
    fetchBasketEvent(basketIds);
  }, [basketIds]);

  const hasError = Object.values(errors).some((el) => el.length > 0);

  return (
    <View style={styles.container}>
      <PageHeader title="Оформление заказа" onBack={() => props?.navigation?.goBack()} />

      {hasError && (
        <View style={styles.errorsBlock}>
          {errors.basket && <ErrorAlert message={errors.basket} />}
          {errors.discounts && <ErrorAlert message={errors.discounts} />}
          {errors.promotions && <ErrorAlert message={errors.promotions} />}
          {errors.warehouses && <ErrorAlert message={errors.warehouses} />}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PaymentMethodCard />
        <DeliveryDateCard />
        <MethodReceiptCard
          navigation={props.navigation}
          pickupAddress={pickupAddress}
          defaultCenter={defaultCenter}
        />
        <AdditionalInformation />
        <OrderSummary
          navigation={props.navigation}
          basketProducts={basketProducts}
          cartDiscounts={cartDiscounts}
          promotions={promotions}
          pickupAddress={pickupAddress}
          defaultCenter={defaultCenter}
          isAgreed={isAgreed}
          onChangeAgreed={setIsAgreed}
        />
      </ScrollView>

      <CheckoutFooter
        navigation={props.navigation}
        basketProducts={basketProducts}
        cartDiscounts={cartDiscounts}
        promotions={promotions}
        pickupAddress={pickupAddress}
        defaultCenter={defaultCenter}
        isAgreed={isAgreed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    rowGap: 8,
    paddingBlock: 8,
  },
  errorsBlock: {
    paddingBlock: 8,
    rowGap: 8,
  },
});
