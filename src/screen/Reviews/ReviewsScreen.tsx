import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { declOfNum } from "../../shared/helpers/declOfNum";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../shared/types/products";
import type { ReviewModel } from "../../shared/types/review";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { NotContent } from "../../widgets/not-content/NotContent";
import { ProductInfoFooter } from "../ProductInfo/components/ProductInfoFooter";
import { ReviewCard } from "../ProductInfo/components/ReviewCard";
import type { PriceItem, StockModel } from "../ProductInfo/types";
import { QuestionsProductInfo } from "../Questions/components/QuestionsProductInfo";
import { ReviewForm } from "./components/ReviewForm";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "ReviewsScreen">;
  route?: {
    key: string;
    name: string;
    params?: { id: number };
  };
};

export const ReviewsScreen = (props: Props) => {
  const id = props.route?.params?.id;
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [stocks, setStocks] = useState<StockModel | null>(null);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isProductError, setIsProductError] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [canReview, setCanReview] = useState<boolean>(false);
  const [myReview, setMyReview] = useState<ReviewModel | null>(null);

  const fetchProductEvent = useEffectEvent((id: number) => {
    fetchService
      .get<ProductModel>({ url: `product/${id}` })
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

  const fetchStocksEvent = useEffectEvent((id: number) => {
    fetchService
      .get<StockModel>({ url: `product-stock/product-available/${id}` })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setStocks(response.data);
        }
      });
  });

  const fetchPricesEvent = useEffectEvent((id: number) => {
    fetchService.get<PriceItem[]>({ url: `product-price/for-user/${id}` }).then((response) => {
      if (response.status === "success" && Array.isArray(response.data)) {
        setPrices(response.data);
      }
    });
  });

  const fetchCanReviewEvent = useEffectEvent((id: number) => {
    fetchService.get<boolean>({ url: `product-review/can-review/${id}` }).then((response) => {
      if (response.status === "success" && typeof response.data === "boolean") {
        setCanReview(response.data);
      }
    });
  });

  const fetchMyReviewEvent = useEffectEvent((id: number) => {
    fetchService.get<ReviewModel | null>({ url: `product-review/my/${id}` }).then((response) => {
      if (response.status === "success") {
        setMyReview(response.data);
      }
    });
  });

  useEffect(() => {
    if (typeof id === "number") {
      fetchProductEvent(id);
      fetchStocksEvent(id);
      fetchPricesEvent(id);
      fetchCanReviewEvent(id);
      fetchMyReviewEvent(id);
    }
  }, [id]);

  const { data, isHasMore, loadMore, loading, reload } = useInfiniteScroll({
    limit: 30,
    fetchData: (page: number) =>
      fetchService
        .get<{ reviews: ReviewModel[]; totalCount: number; paginationPage: number }>({
          url: `product-review/product/${id}`,
          params: {
            page: page ? String(page) : "1",
            limit: String(30),
          },
        })
        .then((response) => {
          if (response.status === "success" && response.data) {
            if (response.data.totalCount > 0 && totalCount !== response.data.totalCount) {
              setTotalCount(response.data.totalCount);
            }
            return {
              data: response.data.reviews,
              total: response.data.totalCount,
            };
          } else {
            throw response.message || "Не удалось загрузить отзывы";
          }
        })
        .catch((error) => {
          throw new Error(getMessageError(error, "Не удалось загрузить отзывы"));
        }),
  });

  const handleChanged = () => reload();

  return (
    <View style={styles.root}>
      <View style={styles.headerContent}>
        {product && (
          <QuestionsProductInfo
            product={product}
            priceList={prices}
            title={
              totalCount > 0
                ? `${totalCount} ${declOfNum(totalCount, ["отзыв", "отзыва", "отзывов"])}`
                : "Отзывы"
            }
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

      <FlatList
        data={data}
        onEndReached={() => isHasMore && !loading && loadMore()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={styles.listHeader}
        ListHeaderComponent={
          <View>
            {id && (
              <ReviewForm
                productId={id}
                myReview={myReview}
                canReview={canReview}
                totalRating={product?.rating || 0}
                totalCount={totalCount}
                onChanged={handleChanged}
              />
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && data.length === 0 ? (
            <NotContent
              title="Пока нет отзывов"
              subTitle="Станьте первым, кто оставит отзыв о товаре"
            />
          ) : undefined
        }
        renderItem={({ item }) => <ReviewCard backgroundColor="white" item={item} />}
        ListFooterComponent={
          loading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#a73afd" />
            </View>
          ) : undefined
        }
      />

      {id && stocks && (
        <ProductInfoFooter
          navigation={props.navigation}
          id={id}
          accounting={stocks.accounting}
          available={stocks.available}
        />
      )}
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
  listHeader: {
    rowGap: 8,
  },
  listContent: {
    paddingTop: 8,
    rowGap: 8,
    paddingBottom: 8,
  },
  footerLoader: {
    paddingVertical: 12,
    alignItems: "center",
  },
});
