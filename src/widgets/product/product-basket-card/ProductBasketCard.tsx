import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { PhotoModel } from "../../../shared/types/photo";
import { ImageMain } from "../../../shared/ui/image/ImageMain";
import { recentAdapter } from "../../../store/recent/adapter";
import { AddBasketLarge } from "../add-basket-large/AddBasketLarge";
import { BasketCardAction } from "../basket-card-action/BasketCardAction";
import { BasketProductCheckbox } from "../basket-product-checkbox/BasketProductCheckbox";
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
  brand_name: string;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
  cardImgHeight: number;
};

export const ProductBasketCard = (props: Props) => {
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
    <View style={styles.root}>
      <View
        style={[
          styles.imageContainer,
          {
            height: props.cardImgHeight,
            minHeight: props.cardImgHeight,
            maxHeight: props.cardImgHeight,
          },
        ]}
      >
        <Pressable onPress={() => handleNavigate(props.id)}>
          <ImageMain uri={props.photos[0].url} style={styles.image} />
        </Pressable>
        <View style={styles.checkBoxContainer}>
          <BasketProductCheckbox id={props.id} />
        </View>
      </View>

      <View style={styles.productInfoContainer}>
        <Pressable onPress={() => handleNavigate(props.id)}>
          <ProductPrice priceList={props.priceList} product_id={props.id} />
          <View style={styles.infoTextContainer}>
            {props.name?.length > 0 && <Text style={styles.textLine}>{props.name || ""}</Text>}

            {props.brand_name?.length > 0 && (
              <Text style={styles.textLine}>{props.brand_name || ""}</Text>
            )}
            {props.rating > 0 && props.reviewCount > 0 && (
              <RatingBadge rating={props.rating} reviewCount={props.reviewCount} />
            )}
            <View style={styles.rightFilter}></View>
          </View>
        </Pressable>
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <AddBasketLarge
              accounting={props.accounting}
              available={props.available}
              id={props.id}
              revalidateBasketAction={revalidateBasketAction}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BasketCardAction id={props.id} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingInline: 6,
    paddingBlock: 8,
    borderRadius: 16,
    flexDirection: "row",
    columnGap: 6,
    backgroundColor: "white",
  },
  imageContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  checkBoxContainer: {
    position: "absolute",
    top: 4,
    left: 4,
  },
  productInfoContainer: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  infoTextContainer: {
    position: "relative",
    rowGap: 4,
  },
  textLine: {
    maxHeight: 16,
    lineHeight: 16,
  },
  rightFilter: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    minHeight: "100%",
    width: 40,
    backgroundImage: "linear-gradient(90deg, rgba(245,247,250,0) 0%, #ffffff 80%)",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    columnGap: 6,
  },
});
