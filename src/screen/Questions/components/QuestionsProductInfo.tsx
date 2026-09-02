import { StyleSheet, Text, View } from "react-native";
import type { ProductModel } from "../../../shared/types/products";
import { PageHeader } from "../../../shared/ui/header/PageHeader";
import { ImageMain } from "../../../shared/ui/image/ImageMain";
import { ProductPrice } from "../../../widgets/product/product-price/ProductPrice";

type Props = {
  product: ProductModel;
  priceList: { price: number; minQuantity: number }[];
  title: string;
  onBack: () => void;
};

export const QuestionsProductInfo = (props: Props) => {
  return (
    <View style={styles.root}>
      <PageHeader title={props.title} onBack={props.onBack} isShowFavorites id={props.product.id} />

      <View style={styles.content}>
        <ImageMain uri={props.product.photos?.[0]?.url || ""} style={styles.image} />

        <View style={styles.productInfo}>
          <ProductPrice product_id={props.product.id} priceList={props.priceList} />
          {props.product.name.length > 0 && (
            <Text numberOfLines={1} style={styles.productName}>
              {props.product.name}
            </Text>
          )}
          {props.product.description.length > 0 && (
            <Text numberOfLines={3} style={styles.productDescription}>
              {props.product.description}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    rowGap: 12,
  },
  content: {
    flexDirection: "row",
    columnGap: 12,
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  image: {
    width: 72,
    height: 96,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    rowGap: 2,
    minWidth: 0,
    overflow: "hidden",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#242424",
  },
  productDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#868695",
  },
});
