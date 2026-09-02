import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import type { ProductModel, ProductSpecificationModel } from "../../shared/types/products";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { recentAdapter } from "../../store/recent/adapter";
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
  const [_similar, setSimilar] = useState<ProductModel[]>([]);
  const [_buyTogether, setBuyTogether] = useState<ProductModel[]>([]);
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

  const fetchInfoEvent = useEffectEvent(async (productId: number) => {
    await fetchProductEvent(productId);
    await fetchCanReviewEvent(productId);
    await fetchPricesEvent(productId);
    await fetchSpecificationsEvent(productId);
    await fetchStocksEvent(productId);
    await fetchReviewsEvent(productId);
    await fetchQuestionsEvent(productId);
    await fetchSimilarEvent(productId);
    await fetchBuyTogetherEvent(productId);
  });

  useEffect(() => {
    if (typeof id === "number") {
      fetchInfoEvent(id);
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!product ? (
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
            {/* Блок 5: Список отзывов (Задача 5) */}
            {/* Блок 6: Похожие + С этим покупают (Задача 6) */}
            {/* Блок 7: Рекомендуем (Задача 7) */}
            {/* Блок 8: Вы недавно смотрели (Задача 8) */}
          </>
        )}
      </ScrollView>
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
    rowGap: 8,
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
});
