import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import type { CartDiscountModel } from "../../shared/types/cart-discount";
import type { ProductModel } from "../../shared/types/products";
import type { PromotionModel } from "../../shared/types/promotion";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { basketStore } from "../../store/basket/store";
import { NotContent } from "../../widgets/not-content/NotContent";
import { BasketDeleteModal } from "./components/BasketDeleteModal";
import { BasketFooter } from "./components/BasketFooter";
import { BasketHeader } from "./components/BasketHeader";
import { BasketList } from "./components/BasketList";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Basket">;
};

export const BasketScreen = (props: Props) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [basketData, setBasketData] = useState<ProductModel[]>([]);
  const [cartDiscounts, setCartDiscounts] = useState<CartDiscountModel[]>([]);
  const [promotions, setPromotions] = useState<PromotionModel[]>([]);
  const basket = basketStore((store) => store.items);
  const basketIds = Object.keys(basket).join(",");
  const [errors, setErrors] = useState<{ basket: string; discounts: string; promotions: string }>({
    basket: "",
    promotions: "",
    discounts: "",
  });

  const updateError = (key: "basket" | "promotions" | "discounts", message: string) =>
    setErrors((prev) => ({ ...prev, [key]: message }));
  const resetError = (key: "basket" | "promotions" | "discounts") =>
    setErrors((prev) => ({ ...prev, [key]: "" }));

  const fetchDiscounts = async () => {
    const discountDefaultErrorMessage = "Не удалось получить список скидок";

    return fetchService
      .get<CartDiscountModel[]>({
        url: "cart-discounts/active",
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setCartDiscounts(response.data);
        } else if (response.status === "error") {
          throw response.message || discountDefaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, discountDefaultErrorMessage);
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
  };

  const fetchPromotions = async () => {
    const promotionDefaultErrorMessage = "Не удалось получить список акций";

    return fetchService
      .get<PromotionModel[]>({
        url: "promotions/active",
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setPromotions(response.data);
        } else if (response.status === "error") {
          throw response.message || promotionDefaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, promotionDefaultErrorMessage);

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
  };

  const fetchBasketEvent = useEffectEvent(async (basketIds: string) => {
    if (basketIds.length > 0) {
      const defaultErrorMessage = "Не удалось получить список просмотренных товаров";

      await fetchService
        .get<ProductModel[]>({
          url: "product/by-ids",
          params: { ids: basketIds },
        })
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setBasketData(response.data);
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
                fetchBasketEvent(basketIds);
                resetError("basket");
              },
            },
          ]);
        });
    } else {
      setBasketData([]);
    }

    await fetchDiscounts();
    await fetchPromotions();
  });

  const fetchUserEvent = useEffectEvent(async () => {
    await fetchService
      .get<ProductModel[]>({
        url: "users/me",
        params: { ids: basketIds },
      })
      .then((response) => {
        console.log("rerender check user");
        if (response.status === "success" && response.data) {
          setIsRegister(true);
        }
      });
  });

  useEffect(() => {
    fetchBasketEvent(basketIds);
    fetchUserEvent();
  }, [basketIds]);

  const hasError = Object.values(errors).some((el) => el.length > 0);

  return (
    <>
      <BasketDeleteModal />
      <View style={{ flex: 1 }}>
        {hasError && (
          <View style={{ paddingBlock: 4, rowGap: 4 }}>
            {errors.basket && <ErrorAlert message={errors.basket} />}
            {errors.discounts && <ErrorAlert message={errors.discounts} />}
            {errors.promotions && <ErrorAlert message={errors.promotions} />}
          </View>
        )}

        {basketIds.length > 0 && !hasError && (
          <>
            <BasketHeader />
            <BasketList navigation={props.navigation} basketData={basketData} />
            <BasketFooter
              navigation={props.navigation}
              basketProducts={basketData}
              cartDiscounts={cartDiscounts}
              promotions={promotions}
              isRegister={isRegister}
            />
          </>
        )}

        {basketIds.length === 0 && !hasError && (
          <NotContent
            title="В корзине пока пусто"
            subTitle="Перейдите на главную и добавьте товары, которые могут вам понравиться."
            navigateText="Перейти на главную"
            onNavigate={() => props.navigation.navigate("HomeStack")}
          />
        )}
      </View>
    </>
  );
};
