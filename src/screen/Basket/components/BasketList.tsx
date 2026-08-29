import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import type { ProductModel } from "../../../shared/types/products";
import { ProductBasketCard } from "../../../widgets/product/product-basket-card/ProductBasketCard";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Basket">;
  basketData: ProductModel[];
};

export const BasketList = (props: Props) => {
  const height = Dimensions.get("window").height;
  const cardImgHeight = (height - 322) / 4;

  return (
    <FlatList
      contentContainerStyle={styles.contentContainerStyle}
      data={props.basketData}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ProductBasketCard
          cardImgHeight={cardImgHeight}
          priceList={item.price_list}
          photos={item.photos}
          accounting={item.accounting}
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
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBlock: 4,
    rowGap: 4,
  },
});
