import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { declOfNum } from "../../shared/helpers/declOfNum";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { ArrowBackIcon } from "../../shared/svg/ArrowBackIcon";
import { favoritesStore } from "../../store/favorites/store";
import { ProductRecent } from "../../widgets/product/product-recent/ProductRecent";
import { ProductRecommended } from "../../widgets/product/product-recommended/ProductRecommended";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Profile">;
};

export const ProfileScreen = (props: Props) => {
  const favorites = favoritesStore((store) => store.items);
  const favoritesCount = Object.values(favorites).length || 0;
  const [counts, setCounts] = useState<{
    orders: number;
    purchases: number;
    waiting: number;
  }>({
    orders: 0,
    purchases: 0,
    waiting: 0,
  });
  const favoritesValue =
    favoritesCount > 0
      ? `${favoritesCount} ${declOfNum(favoritesCount, ["товар", "товара", "товаров"])}`
      : "Нет товаров";

  const fetchOrderCounts = useEffectEvent(() => {
    fetchService
      .get<{
        orders: number;
        purchases: number;
        waiting: number;
      }>({
        url: "orders/order-client-counts",
      })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setCounts({
            orders: response.data?.orders || 0,
            purchases: response.data?.purchases || 0,
            waiting: response.data?.waiting || 0,
          });
        } else {
          throw response.message;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось получить количество заказов");

        Alert.alert("Ошибка", message, [
          {
            text: "Отмена",
            style: "default",
          },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchOrderCounts();
            },
          },
        ]);
      });
  });

  useEffect(() => {
    fetchOrderCounts();
  }, []);

  const navigateList = [
    {
      label: "Заказы",
      value:
        counts.orders > 0
          ? `${counts.orders} ${declOfNum(counts.orders, ["заказ", "заказа", "заказов"])}`
          : "Ближайшие: не ожидаются",
      href: "Orders",
      params: { view: "orders" },
    },
    {
      label: "Покупки",
      value:
        counts.purchases > 0
          ? `Купили ${counts.purchases} раз`
          : "Здесь можно купить что-то заново",
      href: "Orders",
      params: { view: "purchases" },
    },
    {
      label: "Лист ожидания",
      value:
        counts.waiting > 0
          ? `Ожидается ${counts.waiting} ${declOfNum(counts.waiting, ["заказ", "заказа", "заказов"])}`
          : "Нет ожидания",
      href: "Orders",
      params: { view: "waiting" },
    },
    { label: "Избранное", value: favoritesValue, href: favoritesCount > 0 ? "Favorites" : "" },
    {
      label: "Отзывы и вопросы",
      value: "Делитесь мнением и узнавайте о товарах",
      href: "UserReviews",
    },
    { label: "Возврат товара", value: "", href: "Favorites" },
  ];

  return (
    <View style={styles.root}>
      <FlatList
        data={[]}
        ListHeaderComponentStyle={styles.listHeaderComponentStyle}
        ListHeaderComponent={
          <View style={styles.content}>
            <View style={styles.profileInfo}>
              <Text>Телефон:</Text>
              <Text style={styles.profileInfoPhone}>+7 949 386-57-86</Text>
            </View>

            <View>
              {navigateList.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() =>
                    item.href && props.navigation.push(item.href, item.params ? item.params : {})
                  }
                >
                  <View style={styles.navigateItem}>
                    <View style={styles.navigateItemLeftSide}>
                      <Text style={styles.navigateItemTextLabel}>{item.label}</Text>
                      {item.value && <Text style={styles.navigateItemText}>{item.value}</Text>}
                    </View>

                    <View style={styles.navigateItemRightSide}>
                      {item.href.length > 0 && <ArrowBackIcon fill="black" size={20} />}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
            <ProductRecent navigation={props.navigation} isHasNavigateSeeAll />
          </View>
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponentStyle={styles.listFooterComponentStyle}
        ListFooterComponent={
          <View>
            <ProductRecommended title="Подобрали для вас" navigation={props.navigation} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    paddingTop: 16,
  },
  content: {
    flex: 1,
    paddingInline: 12,
    rowGap: 16,
  },
  listHeaderComponentStyle: {
    rowGap: 16,
  },
  listFooterComponentStyle: {
    paddingTop: 16,
    rowGap: 16,
  },
  profileInfo: {
    flexDirection: "row",
    columnGap: 8,
  },
  profileInfoPhone: {
    fontSize: 13,
    color: "#545454",
  },
  navigateItem: {
    borderColor: "#c8c8d1",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingBlock: 8,
    alignItems: "center",
  },
  navigateItemLeftSide: {
    flex: 1,
    rowGap: 4,
  },
  navigateItemRightSide: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(180deg)",
  },
  navigateItemTextLabel: {
    fontWeight: 500,
  },
  navigateItemText: {
    color: "#545454",
    fontSize: 12,
  },
});
