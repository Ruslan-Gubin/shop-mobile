import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getProductDimensions } from "../../../shared/helpers/getProductDimensions";
import { getSpecificationsProductInfo } from "../../../shared/helpers/getSpecificationsProductInfo";
import type { ProductModel, ProductSpecificationModel } from "../../../shared/types/products";
import { ProductPrice } from "../../../widgets/product/product-price/ProductPrice";
import { RatingBadge } from "../../../widgets/product/rating-badge/RatingBadge";
import { OptionsList } from "./OptionsList";

type Props = {
  product: ProductModel;
  specifications: ProductSpecificationModel[];
  priceList: { price: number; minQuantity: number }[];
};

export const ProductInfoBlock = (props: Props) => {
  const { product, specifications } = props;

  const [isOpenDescription, setIsOpenDescription] = useState(false);

  const DESCRIPTION_LIMIT = 250;
  const specificationItems = getSpecificationsProductInfo(product, specifications);
  const dimensions = getProductDimensions(product);
  const brandName = product.brand_name && product.brand_name.length > 0 ? product.brand_name : "";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {brandName.length > 0 && <Text style={styles.brand}>{brandName}</Text>}
        {Array.isArray(props.priceList) && props.priceList.length > 0 && (
          <ProductPrice priceList={props.priceList} product_id={props.product.id} />
        )}
        {product.name.length > 0 && <Text style={styles.title}>{product.name}</Text>}

        {product.rating > 0 && product.review_count > 0 && (
          <RatingBadge rating={product.rating} reviewCount={product.review_count} />
        )}

        {product.description.length > 0 && (
          <>
            <Text style={styles.description} numberOfLines={isOpenDescription ? undefined : 7}>
              {product.description}
            </Text>
            {product.description.length >= DESCRIPTION_LIMIT && (
              <Pressable onPress={() => setIsOpenDescription((prev) => !prev)}>
                <Text style={styles.showMore}>
                  {isOpenDescription ? "Свернуть" : "Показать полное описание"}
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      {specificationItems.length > 0 && (
        <OptionsList title="Характеристики" options={specificationItems} />
      )}
      {dimensions.length > 0 && <OptionsList title="Габариты" options={dimensions} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingInline: 12,
    marginTop: 16,
    rowGap: 12,
  },
  header: {
    rowGap: 6,
  },
  brand: {
    color: "#a73afd",
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    lineHeight: 20,
    color: "#3f3e4e",
  },
  showMore: {
    color: "#9a1cc6",
    fontSize: 13,
  },
});
