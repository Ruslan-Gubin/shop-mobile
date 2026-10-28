import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FeatureCollection, Polygon, Position } from "geojson";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { CONFIG_APP } from "../../shared/config/config";
import { fetchService } from "../../shared/fetch-api";
import { getDeliveryParams } from "../../shared/helpers/getDeliveryParams";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { getOrderAddress } from "../../shared/helpers/getOrderAddress";
import type { CartDiscountModel } from "../../shared/types/cart-discount";
import type { ProductModel } from "../../shared/types/products";
import type { PromotionModel } from "../../shared/types/promotion";
import type { SectorModel } from "../../shared/types/sectors";
import type { WarehouseModel } from "../../shared/types/warehouse";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { basketStore } from "../../store/basket/store";
import { checkoutAdapter } from "../../store/checkout/adapter";
import { checkoutStore } from "../../store/checkout/store";
import type { AddressItem } from "../../store/checkout/types";
import { NotContent } from "../../widgets/not-content/NotContent";
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
  const selected = basketStore((store) => store.selected);
  const checkoutPhone = checkoutStore((store) => store.phone);
  const method_receipt = checkoutStore((store) => store.method_receipt);

  const [basketProducts, setBasketProducts] = useState<ProductModel[]>([]);
  const [cartDiscounts, setCartDiscounts] = useState<CartDiscountModel[]>([]);
  const [promotions, setPromotions] = useState<PromotionModel[]>([]);
  const [pickupAddress, setPickupAddress] = useState<AddressItem[]>([]);
  const courierAddress = checkoutStore((store) => store.courierAddress);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);

  const [sectors, setSectors] = useState<
    FeatureCollection<Polygon, { id: number; color: string; price: number; min_sum: number }>
  >({ type: "FeatureCollection", features: [] });
  const [defaultCenter, setDefaultCenter] = useState<{ lng: number; lat: number }>({
    lng: CONFIG_APP.DEFAULT_MAP_CENTER_LNG,
    lat: CONFIG_APP.DEFAULT_MAP_CENTER_LAT,
  });
  const [isDeliveryCourier, setIsDeliveryCourier] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState(false);

  const [errors, setErrors] = useState<{
    basket: string;
    discounts: string;
    promotions: string;
    warehouses: string;
    sectors: string;
  }>({ basket: "", discounts: "", promotions: "", warehouses: "", sectors: "" });
  const [isAgreed, setIsAgreed] = useState(true);

  const updateError = (
    key: "basket" | "discounts" | "promotions" | "warehouses" | "sectors",
    message: string,
  ) => setErrors((prev) => ({ ...prev, [key]: message }));
  const resetError = (key: "basket" | "discounts" | "promotions" | "warehouses" | "sectors") =>
    setErrors((prev) => ({ ...prev, [key]: "" }));

  const fetchWarehouses = useEffectEvent(async () => {
    const defaultErrorMessage = "Не удалось получить список складов";

    await fetchService
      .get<WarehouseModel[]>({ url: "warehouses/public" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          const pickup: AddressItem[] = [];
          let default_lng = 0;
          let default_lat = 0;

          for (let i = 0; i < response.data.length; i++) {
            const warehouse = response.data[i];

            if (
              Object.hasOwn(warehouse, "address") &&
              warehouse.address &&
              (warehouse.is_active || warehouse.default_warehouse)
            ) {
              pickup.push(warehouse.address);

              if (warehouse.default_warehouse) {
                default_lng = warehouse.address.lng;
                default_lat = warehouse.address.lat;
              }
            }
          }

          setPickupAddress(pickup);

          if (default_lng > 0 && default_lat > 0) {
            setDefaultCenter({
              lng: default_lng,
              lat: default_lat,
            });
          }
        } else if (response.status === "error") {
          throw response.message;
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

  const fetchUser = useEffectEvent(() => {
    fetchService
      .get<{
        email: string | null;
        id: number;
        name: string;
        phone: string;
        role: string;
      }>({
        url: "users/me",
      })
      .then((response) => {
        if (
          response.status === "success" &&
          response.data &&
          response.data.phone.length > 0 &&
          !checkoutPhone
        ) {
          checkoutAdapter.changeAdditionalInfoInputs(response.data.phone, "phone");
        }
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
            throw response.message;
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
  });

  const fetchDiscounts = useEffectEvent(async () => {
    const defaultErrorMessage = "Не удалось получить список скидок";

    await fetchService
      .get<CartDiscountModel[]>({ url: "cart-discounts/active" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setCartDiscounts(response.data);
        } else if (response.status === "error") {
          throw response.message;
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
          throw response.message;
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

  const fetchDeliverySectors = useEffectEvent(async () => {
    const defaultErrorMessage = "Не удалось получить список секторов для доставки";

    await fetchService
      .get<SectorModel[]>({ url: "sectors/delivery" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setSectors({
            type: "FeatureCollection",
            features: response.data.map((sector) => ({
              type: "Feature",
              properties: {
                id: sector.id,
                color: sector.color,
                price: sector.price,
                min_sum: sector.min_sum,
              },
              geometry: { type: "Polygon", coordinates: [sector.coordinates as Position[]] },
            })),
          });
          setIsDeliveryCourier(response.data.length > 0);
          if (response.data.length === 0) {
            checkoutAdapter.setMethodReceipt("pickup");
          }
        } else if (response.status === "error") {
          throw response.message;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        updateError("sectors", message);

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchDeliverySectors();
              resetError("sectors");
            },
          },
        ]);
      });
  });

  useEffect(() => {
    fetchBasketEvent(basketIds);
    fetchDiscounts();
    fetchPromotions();
    fetchWarehouses();
    fetchDeliverySectors();
    fetchUser();
  }, [basketIds]);

  const hasError = Object.values(errors).some((el) => el.length > 0);
  const hasBasketItems = Object.keys(basket).length > 0;
  const hasSelectedItems = selected.length > 0;
  const notContentSubtitle =
    hasBasketItems && !hasSelectedItems
      ? "Перейдите в корзину и выберите товар"
      : "Перейдите на главную и добавьте товары, которые могут вам понравиться.";

  const address = getOrderAddress(
    defaultCenter,
    pickupAddress,
    courierAddress,
    method_receipt,
    activePickup,
    activeCourier,
  );

  const deliveryParams = useMemo(
    () => getDeliveryParams(method_receipt, address, sectors.features),
    [method_receipt, address, sectors.features],
  );

  return (
    <View style={styles.container}>
      <PageHeader title="Оформление заказа" onBack={() => props?.navigation?.goBack()} />

      {(!hasSelectedItems || !hasBasketItems) && (
        <NotContent
          title="Невозможно оформить заказ"
          subTitle={notContentSubtitle}
          navigateText={
            hasBasketItems && !hasSelectedItems ? "Перейти в корзину" : "Перейти на главную"
          }
          onNavigate={() =>
            hasBasketItems && !hasSelectedItems
              ? props.navigation.push("Basket")
              : props.navigation.navigate("HomeStack")
          }
        />
      )}

      {hasError && (
        <View style={styles.errorsBlock}>
          {errors.basket && <ErrorAlert message={errors.basket} />}
          {errors.discounts && <ErrorAlert message={errors.discounts} />}
          {errors.promotions && <ErrorAlert message={errors.promotions} />}
          {errors.warehouses && <ErrorAlert message={errors.warehouses} />}
          {errors.sectors && <ErrorAlert message={errors.sectors} />}
        </View>
      )}

      {hasBasketItems && hasSelectedItems && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <PaymentMethodCard />
          <DeliveryDateCard />
          <MethodReceiptCard
            address={address}
            selectModal={selectModal}
            setSelectModal={setSelectModal}
            method_receipt={method_receipt}
            minOrderSum={deliveryParams.min_sum}
            isDeliveryCourier={isDeliveryCourier}
            navigation={props.navigation}
            pickupAddress={pickupAddress}
            defaultCenter={defaultCenter}
          />
          <AdditionalInformation />
          <OrderSummary
            delivery_price={deliveryParams.price}
            address={address}
            sectors={sectors}
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
      )}

      <CheckoutFooter
        delivery_price={deliveryParams.price}
        address={address}
        method_receipt={method_receipt}
        setSelectModal={setSelectModal}
        minOrderSum={deliveryParams.min_sum}
        sectors={sectors}
        isShowButton={hasBasketItems && hasSelectedItems}
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
