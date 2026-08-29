import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { formatterRub } from "../../shared/helpers/formatters";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { DeleteSvg } from "../../shared/svg/DeleteSvg";
import { HeartSvg } from "../../shared/svg/HeartSvg";
import type { ProductModel } from "../../shared/types/products";
import { Checkbox } from "../../shared/ui/checkbox/Checkbox";
import { basketStore } from "../../store/basket/store";
import { ProductBasketCard } from "../../widgets/product/product-basket-card/ProductBasketCard";
import { BasketDeleteModal } from "../../widgets/modal/basket/BasketDeleteModal";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Home">;
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

  const height = Dimensions.get("window").height;
  const cardImgHeight = (height - 322) / 4;

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

  const disabledSubmit = false; // props.type === "checkout" ? orderInfo.total === 0 || address === null : orderInfo.total === 0;
  const total = 238;

  return (
    <>
      <BasketDeleteModal
        revalidateBasketAction={() => new Promise(() => console.log("revalidate basket"))}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 0.5 }}>
            <Checkbox
              checked={selectAll}
              label="Все"
              onPress={() => setSelectAll((prev) => !prev)}
            />
          </View>
          <View style={styles.headerRightSide}>
            <Pressable
              disabled={!isHasSelect}
              onPress={() => console.log("press heart")}
              style={styles.headerIconButton}
            >
              <HeartSvg active={false} size={20} fill={isHasSelect ? "gray" : "#c8c8d1"} />
            </Pressable>
            <Pressable
              disabled={!isHasSelect}
              onPress={() => console.log("press delete")}
              style={styles.headerIconButton}
            >
              <DeleteSvg size={20} fill={isHasSelect ? "gray" : "#c8c8d1"} />
            </Pressable>
          </View>
        </View>

        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={basketData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ProductBasketCard
              cardImgHeight={cardImgHeight}
              width={400}
              priceList={item.price_list}
              index={index}
              photos={item.photos}
              accounting={true}
              available={item.available}
              id={item.id}
              name={item.name}
              rating={item.rating}
              reviewCount={item.review_count}
              brand_name={item.brand_name}
              navigation={props.navigation}
            />
          )}
        />
        <View style={styles.footer}>
          <Pressable
            disabled={disabledSubmit}
            onPress={() => props?.navigation.push("Checkout")}
            style={[styles.footerButton, !disabledSubmit && styles.footerButtonActive]}
          >
            <Text
              style={[styles.footerButtonText, !disabledSubmit && styles.footerButtonTextActive]}
            >
              {disabledSubmit ? "Выберите товары" : "К оформлению: 1"}
            </Text>

            {!disabledSubmit && (
              <Text
                style={[
                  styles.footerButtonText,
                  !disabledSubmit && styles.footerButtonTextActiveTotal,
                ]}
              >
                {formatterRub.format(total)}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingBlock: 6,
    paddingInline: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  headerRightSide: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    columnGap: 6,
  },
  headerIconButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainerStyle: {
    paddingBlock: 4,
    rowGap: 4,
  },
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
});
