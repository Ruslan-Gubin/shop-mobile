import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getProductDimensions } from "../../../shared/helpers/getProductDimensions";
import { getSpecificationsProductInfo } from "../../../shared/helpers/getSpecificationsProductInfo";
import type { ProductModel, ProductSpecificationModel } from "../../../shared/types/products";
import { ProductPrice } from "../../../widgets/product/product-price/ProductPrice";
import { RatingBadge } from "../../../widgets/product/rating-badge/RatingBadge";

type Props = {
  product: ProductModel;
  specifications: ProductSpecificationModel[];
  priceList: { price: number; minQuantity: number }[];
};

const OptionsList = ({
  title,
  options,
}: {
  title: string;
  options: { label: string; value: string }[];
}) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsList}>
        {options.map((item) => (
          <View key={item.label} style={styles.optionsItem}>
            <Text style={styles.optionsLabel}>{item.label}</Text>
            <Text style={styles.optionsValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
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
        {Boolean(brandName) && <Text style={styles.brand}>{brandName}</Text>}
        <ProductPrice priceList={props.priceList} product_id={props.product.id} />
        {Boolean(product.name) && <Text style={styles.title}>{product.name}</Text>}

        {product.rating > 0 && product.review_count > 0 && (
          <RatingBadge rating={product.rating} reviewCount={product.review_count} />
        )}
      </View>

      {product.description.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
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
        </View>
      )}

      <OptionsList title="Характеристики" options={specificationItems} />
      <OptionsList title="Габариты" options={dimensions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingInline: 12,
    marginTop: 16,
    rowGap: 16,
  },
  header: {
    rowGap: 8,
  },
  brand: {
    color: "#a73afd",
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    rowGap: 8,
  },
  sectionTitle: {
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
  optionsList: {
    rowGap: 8,
  },
  optionsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 12,
  },
  optionsLabel: {
    flex: 1,
    color: "#8a8999",
    fontSize: 13,
  },
  optionsValue: {
    flex: 1,
    fontSize: 13,
  },
});
