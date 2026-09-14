import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import type { ProductModel } from "../../shared/types/products";
import type { ReviewModel } from "../../shared/types/review";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import type { PriceItem } from "../ProductInfo/types";
import { QuestionsProductInfo } from "../Questions/components/QuestionsProductInfo";
import { ReviewForm } from "../Reviews/components/ReviewForm";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "UserProductReview">;
  route?: {
    key: string;
    name: string;
    params?: { id: number };
  };
};

export const UserProductReviewScreen = (props: Props) => {
  const id = props.route?.params?.id;

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [myReview, setMyReview] = useState<ReviewModel | null>(null);
  const [isProductError, setIsProductError] = useState<boolean>(false);

  const fetchProduct = useEffectEvent((productId: number) => {
    fetchService
      .get<ProductModel>({ url: `product/${productId}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setProduct(response.data);
        } else {
          throw response.message || "Не удалось загрузить информацию о товаре";
        }
      })
      .catch(() => {
        setIsProductError(true);
      });
  });

  const fetchPrices = useEffectEvent((productId: number) => {
    fetchService
      .get<PriceItem[]>({ url: `product-price/for-user/${productId}` })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setPrices(response.data);
        }
      });
  });

  const fetchMyReview = useEffectEvent((productId: number) => {
    fetchService
      .get<ReviewModel | null>({ url: `product-review/my/${productId}` })
      .then((response) => {
        if (response.status === "success") {
          setMyReview(response.data);
        }
      });
  });

  useEffect(() => {
    if (typeof id === "number") {
      fetchProduct(id);
      fetchPrices(id);
      fetchMyReview(id);
    }
  }, [id]);

  const handleChanged = (action?: "create" | "edit" | "delete") => {
    if (action === "delete") {
      props.navigation?.goBack();
      return;
    }

    if (typeof id === "number") {
      fetchMyReview(id);
    }
  };

  const handleGoToProduct = () => {
    if (typeof id === "number" && typeof props.navigation?.push === "function") {
      props.navigation?.push("ProductInfo", { id });
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerContent}>
        {product && (
          <QuestionsProductInfo
            product={product}
            priceList={prices}
            title="Мой отзыв"
            onBack={() => props?.navigation?.goBack()}
          />
        )}
      </View>

      {isProductError && (
        <ErrorAlert
          message="Не удалось загрузить информацию о товаре"
          callback={{
            action() {
              props.navigation?.goBack();
            },
            text: "Вернуться назад",
          }}
        />
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {id && (
          <ReviewForm
            productId={id}
            myReview={myReview}
            canReview
            totalRating={product?.rating || 0}
            totalCount={product?.review_count || 0}
            onChanged={handleChanged}
            initActive={myReview !== null}
            isNotClose={true}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={handleGoToProduct}
          style={({ pressed }) => [styles.goToProductButton, pressed && styles.pressed]}
        >
          <Text style={styles.goToProductText}>Перейти к товару</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerContent: {
    rowGap: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  footer: {
    backgroundColor: "white",
    paddingInline: 12,
    paddingBlock: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  goToProductButton: {
    backgroundColor: "#a73afd",
    borderRadius: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  goToProductText: {
    fontWeight: "bold",
    color: "white",
  },
  pressed: {
    opacity: 0.6,
  },
});

