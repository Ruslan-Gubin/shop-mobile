import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getWidthCard } from "../../../shared/helpers/getWidthCard";
import type { ProductModel } from "../../../shared/types/products";
import { ProductCard } from "../product-card/ProductCard";

type Props = {
  title: string;
  data: ProductModel[];
  onSeeAll?: () => void;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const HorizontalProductList = (props: Props) => {
  const width = getWidthCard(Dimensions.get("window").width, 24, 4, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
        {props.onSeeAll && (
          <Pressable onPress={props.onSeeAll}>
            <Text style={styles.seeAll}>Все →</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={props.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <ProductCard
            horizontal
            navigation={props.navigation}
            width={width}
            priceList={item.price_list}
            index={index}
            photos={item.photos}
            accounting={item.accounting}
            available={item.available}
            id={item.id}
            name={item.name}
            rating={item.rating}
            reviewCount={item.review_count}
            brand_name={item.brand_name}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "400",
    color: "#9a1cc6",
  },
  listContent: {
    columnGap: 4,
  },
});
