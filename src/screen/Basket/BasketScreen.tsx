import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import type { ProductModel } from "../../shared/types/products";
import { basketStore } from "../../store/basket/store";
import { BasketDeleteModal } from "../../widgets/modal/basket/BasketDeleteModal";
import { BasketFooter } from "./components/BasketFooter";
import { BasketHeader } from "./components/BasketHeader";
import { BasketList } from "./components/BasketList";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Basket">;
};

export const BasketScreen = (props: Props) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [basketData, setBasketData] = useState<ProductModel[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isHasSelect = false;
  const basket = basketStore((store) => store.items);
  const isNavigateCheckout = isHasSelect;
  const basketIds = Object.keys(basket).join(",");
  const defaultErrorMessage = "Не удалось получить список просмотренных товаров";

  const fetchBasketEvent = useEffectEvent((basketIds: string) => {
    if (basketIds.length > 0) {
      fetchService
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

          setErrorMessage(message);

          Alert.alert("Ошибка", message, [
            { text: "Отмена", style: "default" },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                fetchBasketEvent(basketIds);
                setErrorMessage("");
              },
            },
          ]);
        });
    }
  });

  useEffect(() => {
    fetchBasketEvent(basketIds);
  }, [basketIds]);

  //const isHasOrderItems = props.basketProducts.length > 0;
  const isHasOrderItems = 0;

  // const orderInfo = useMemo(
  //   () =>
  //     calcBasketInfo(selected, basket, props.basketProducts, props.cartDiscounts, props.promotions),
  //   [selected, basket, props.basketProducts, props.cartDiscounts, props.promotions],
  // );

  return (
    <>
      <BasketDeleteModal
        revalidateBasketAction={() => new Promise(() => console.log("revalidate basket"))}
      />
      <View style={styles.container}>
        <BasketHeader />
        <BasketList navigation={props.navigation} basketData={basketData} />
        <BasketFooter navigation={props.navigation} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
