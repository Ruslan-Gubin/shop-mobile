import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { PhotoModel } from "../../../shared/types/photo";
import { recentAdapter } from "../../../store/recent/adapter";
import { AddBasket } from "../add-basket/AddBasket";
import { ProductCardImage } from "../product-card-image/ProductCardImage";
import { ProductFavorites } from "../product-favorites/ProductFavorites";
import { ProductPrice } from "../product-price/ProductPrice";
import { RatingBadge } from "../rating-badge/RatingBadge";

type Props = {
  name: string;
  priceList: { price: number; minQuantity: number }[];
  id: number;
  available: number | null;
  accounting: boolean;
  rating: number;
  reviewCount: number;
  photos: PhotoModel[];
  index: number;
  brand_name: string;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  width: number;
  horizontal?: boolean;
};

export const ProductCard = (props: Props) => {
  const revalidateBasketAction = async () => {
    new Promise(() => {
      console.log("revalidate");
    });
  };

  const handleNavigate = (id: number) => {
    if (props.navigation) {
      props.navigation.push("ProductInfo", { id });
      recentAdapter.add(id);
    }
  };

  return (
    <View style={{ width: props.width }}>
      <View style={styles.imageContainer}>
        <ProductCardImage
          horizontal={props.horizontal}
          photos={props.photos}
          handleNavigate={handleNavigate}
          id={props.id}
        />
        <ProductFavorites id={props.id} />
        <AddBasket
          available={props.available}
          id={props.id}
          revalidateBasketAction={revalidateBasketAction}
        />
      </View>

      <Pressable onPress={() => handleNavigate(props.id)} style={styles.productInfoContainer}>
        <ProductPrice priceList={props.priceList} product_id={props.id} />
        {props.brand_name?.length > 0 && (
          <Text style={styles.textLine}>{props.brand_name || ""}</Text>
        )}
        {props.name?.length > 0 && <Text style={styles.textLine}>{props.name || ""}</Text>}
        {props.rating > 0 && props.reviewCount > 0 && (
          <RatingBadge rating={props.rating} reviewCount={props.reviewCount} />
        )}
        <View style={styles.rightFilter}></View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    aspectRatio: 3 / 4,
    maxWidth: "100%",
  },
  productInfoContainer: {
    padding: 8,
    rowGap: 4,
    position: "relative",
  },
  textLine: {
    maxHeight: 16,
    lineHeight: 16,
  },
  rightFilter: {
    position: "absolute",
    top: 8,
    right: 0,
    height: "100%",
    minHeight: "100%",
    width: 40,
    backgroundImage: "linear-gradient(90deg, rgba(245,247,250,0) 0%, #ffffff 80%)",
  },
});
