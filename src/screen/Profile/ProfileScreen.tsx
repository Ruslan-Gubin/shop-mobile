import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { declOfNum } from "../../shared/helpers/declOfNum";
import { ArrowBackIcon } from "../../shared/svg/ArrowBackIcon";
import type { ProductModel } from "../../shared/types/products";
import { favoritesStore } from "../../store/favorites/store";
import { recentStore } from "../../store/recent/store";
import { HorizontalProductList } from "../../widgets/product/horizontal-product-list/HorizontalProductList";
import { PickedForYou } from "../../widgets/product/picked-for-you/PickedForYou";
import { ProductCard } from "../../widgets/product/product-card/ProductCard";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Profile">;
};

export const ProfileScreen = (props: Props) => {
  const [recentData, setRecentData] = useState<ProductModel[]>([]);
  const recent = recentStore((store) => store.items);
  const favorites = favoritesStore((store) => store.items);
  const favoritesCount = Object.values(favorites).length || 0;
  const favoritesValue =
    favoritesCount > 0
      ? `${favoritesCount} ${declOfNum(favoritesCount, ["товар", "товара", "товаров"])}`
      : "Нет товаров";
  const ids = Object.values(recent)
    .map((r) => r)
    .join(",");

  const fetchInitData = () => {
    fetchService
      .get<ProductModel[]>({
        url: "product/by-ids",
        params: { ids },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setRecentData(response.data);
        }
      });
  };

  useEffect(() => {
    fetchInitData();
  }, [recent]);

  const navigateList = [
    { label: "Заказы", value: "Ближайшие: не ожидаются", href: "Favorites" },
    { label: "Покупки", value: "Здесь можно купить что-то заново", href: "Favorites" },
    { label: "Лист ожидания", value: "Нет товаров", href: "Favorites" },
    { label: "Избранное", value: favoritesValue, href: favoritesCount > 0 ? "Favorites" : "" },
    {
      label: "Отзывы и вопросы",
      value: "Делитесь мнением и узнавайте о товарах",
      href: "Favorites",
    },
    { label: "Возврат товара", value: "", href: "Favorites" },
  ];

  const mockArr = new Array(50);

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
                  onPress={() => item.href && props.navigation.push(item.href)}
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

            {recentData.length > 0 && (
              <HorizontalProductList
                navigation={props.navigation}
                title="Вы смотрели"
                data={recentData}
                onSeeAll={
                  recentData.length > 6 ? () => props?.navigation?.push("Recent") : undefined
                }
              />
            )}
            {mockArr.map((item, index) => (
              <Text key={index}>Item {index + 1}</Text>
            ))}
          </View>
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponentStyle={styles.listFooterComponentStyle}
        ListFooterComponent={
          <>
            <PickedForYou title="Подобрали для вас" />
          </>
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
