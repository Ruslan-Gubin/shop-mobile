import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import type { ProductModel, ProductSpecificationModel } from "../../shared/types/products";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { recentAdapter } from "../../store/recent/adapter";
import { HorizontalProductList } from "../../widgets/product/horizontal-product-list/HorizontalProductList";
import { ProductRecent } from "../../widgets/product/product-recent/ProductRecent";
import { ProductRecommended } from "../../widgets/product/product-recommended/ProductRecommended";
import { ActivityTabs } from "./components/ActivityTabs";
import { ProductInfoBlock } from "./components/ProductInfoBlock";
import { ProductInfoFooter } from "./components/ProductInfoFooter";
import { ProductPhotos } from "./components/ProductPhotos";
import type { PriceItem, QuestionCollection, ReviewCollection, StockModel } from "./types";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "ProductInfo">;
  route?: {
    key: string;
    name: string;
    params?: { id: number };
  };
};

export const ProductInfoScreen = (props: Props) => {
  const id = props.route?.params?.id;

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [_prices, setPrices] = useState<PriceItem[]>([]);
  const [specifications, setSpecifications] = useState<ProductSpecificationModel[]>([]);
  const [stocks, setStocks] = useState<StockModel | null>(null);
  const [reviews, setReviews] = useState<ReviewCollection>({
    reviews: [],
    totalCount: 0,
    paginationPage: 1,
  });
  const [questions, setQuestions] = useState<QuestionCollection>({
    questions: [],
    totalCount: 0,
    paginationPage: 1,
  });
  const [similar, setSimilar] = useState<ProductModel[]>([]);
  const [buyTogether, setBuyTogether] = useState<ProductModel[]>([]);
  const [canReview, setCanReview] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ product: string }>({ product: "" });

  const fetchProductEvent = useEffectEvent(async (productId: number) => {
    const defaultErrorMessage = "Не удалось загрузить информацию о товаре";

    return fetchService
      .get<ProductModel>({ url: `product/increment-view/${productId}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setProduct(response.data);
          recentAdapter.add(productId);
        } else if (response.status === "error") {
          throw response.message || defaultErrorMessage;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, defaultErrorMessage);
        setErrors((prev) => ({ ...prev, product: message }));
      });
  });

  const fetchCanReviewEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<boolean>({ url: `product-review/can-review/${productId}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setCanReview(response.data);
        }
      });
  });

  const fetchPricesEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<PriceItem[]>({ url: `product-price/for-user/${productId}` })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setPrices(response.data);
        }
      });
  });

  const fetchSpecificationsEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<ProductSpecificationModel[]>({
        url: `product-specifications/product/${productId}`,
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setSpecifications(response.data);
        }
      });
  });

  const fetchStocksEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<StockModel>({ url: `product-stock/product-available/${productId}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setStocks(response.data);
        }
      });
  });

  const fetchReviewsEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<ReviewCollection>({
        url: `product-review/product/${productId}`,
        params: { page: "1", limit: "30" },
      })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setReviews(response.data);
        }
      });
  });

  const fetchQuestionsEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<QuestionCollection>({
        url: `product-question/product/${productId}`,
        params: { page: "1", limit: "30" },
      })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setQuestions(response.data);
        }
      });
  });

  const fetchSimilarEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<ProductModel[]>({ url: `product/similar/${productId}` })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setSimilar(response.data);
        }
      });
  });

  const fetchBuyTogetherEvent = useEffectEvent(async (productId: number) => {
    return fetchService
      .get<ProductModel[]>({
        url: "product/buy-together",
        params: { ids: String(productId) },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setBuyTogether(response.data);
        }
      });
  });

  useEffect(() => {
    if (typeof id === "number") {
      fetchProductEvent(id);
      fetchCanReviewEvent(id);
      fetchPricesEvent(id);
      fetchSpecificationsEvent(id);
      fetchStocksEvent(id);
      fetchReviewsEvent(id);
      fetchQuestionsEvent(id);
      fetchSimilarEvent(id);
      fetchBuyTogetherEvent(id);
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <PageHeader
        title={product?.name || ""}
        onBack={() => props.navigation?.goBack()}
        isShowFavorites
        id={id}
      />

      {errors.product && <ErrorAlert message={errors.product} />}

      <FlatList
        data={[]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponentStyle={styles.listHeaderComponentStyle}
        ListHeaderComponent={
          !product ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#a73afd" />
            </View>
          ) : (
            <>
              <View style={styles.productCard}>
                <ProductPhotos photos={product.photos} />
                <ProductInfoBlock product={product} specifications={specifications} />
              </View>
              <ActivityTabs
                id={product.id}
                reviews={reviews}
                questions={questions}
                canReview={canReview}
                navigation={props.navigation}
              />
            </>
          )
        }
        ListFooterComponent={
          product ? (
            <>
              {similar.length > 0 && (
                <View style={styles.blockContainer}>
                  <HorizontalProductList
                    title="Похожие товары"
                    data={similar}
                    navigation={props.navigation}
                  />
                </View>
              )}
              {buyTogether.length > 0 && (
                <View style={styles.blockContainer}>
                  <HorizontalProductList
                    title="С этим покупают"
                    data={buyTogether}
                    navigation={props.navigation}
                  />
                </View>
              )}
              <View style={styles.blockContainer}>
                <ProductRecommended title="Рекомендуем" navigation={props.navigation} />
              </View>
              {id && (
                <View style={styles.footerBlockSpacing}>
                  <ProductRecent excludeId={id} navigation={props.navigation} />
                </View>
              )}
            </>
          ) : undefined
        }
        ListFooterComponentStyle={styles.listFooterComponentStyle}
      />
      {id && stocks && (
        <ProductInfoFooter
          navigation={props.navigation}
          id={id}
          accounting={stocks?.accounting}
          available={stocks?.available}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 8,
  },
  listHeaderComponentStyle: {
    rowGap: 8,
  },
  listFooterComponentStyle: {
    paddingTop: 8,
    rowGap: 8,
  },
  footerBlockSpacing: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  productCard: {
    backgroundColor: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    paddingBottom: 16,
  },
  loader: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  blockContainer: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
});
