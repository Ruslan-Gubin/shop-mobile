import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { declOfNum } from "../../shared/helpers/declOfNum";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../shared/types/products";
import type { QuestionModel } from "../../shared/types/question";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { NotContent } from "../../widgets/not-content/NotContent";
import { QuestionCard } from "../../widgets/question/QuestionCard";
import { ProductInfoFooter } from "../ProductInfo/components/ProductInfoFooter";
import type { PriceItem, StockModel } from "../ProductInfo/types";
import { QuestionsForm } from "./components/QuestionsForm";
import { QuestionsProductInfo } from "./components/QuestionsProductInfo";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "QuestionsScreen">;
  route?: {
    key: string;
    name: string;
    params?: { id: number };
  };
};

export const QuestionsScreen = (props: Props) => {
  const id = props.route?.params?.id;

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [stocks, setStocks] = useState<StockModel | null>(null);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isProductError, setIsProductError] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

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

  const fetchPricesEvent = useEffectEvent((id: number) => {
    fetchService.get<PriceItem[]>({ url: `product-price/for-user/${id}` }).then((response) => {
      if (response.status === "success" && Array.isArray(response.data)) {
        setPrices(response.data);
      }
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

  useEffect(() => {
    if (typeof id === "number") {
      fetchProductEvent(id);
      fetchStocksEvent(id);
      fetchPricesEvent(id);
    }
  }, [id]);

  const { data, isHasMore, loadMore, loading } = useInfiniteScroll({
    limit: 30,
    fetchData: (page: number) =>
      fetchService
        .get<{ questions: QuestionModel[]; totalCount: number; paginationPage: number }>({
          url: `product-question/product/${id}`,
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
              data: response.data.questions,
              total: response.data.totalCount,
            };
          } else {
            throw response.message || "Не удалось загрузить вопросы";
          }
        })
        .catch((error) => {
          throw new Error(getMessageError(error, "Не удалось загрузить вопросы"));
        }),
  });

  return (
    <View style={styles.root}>
      <View style={styles.headerContent}>
        {product && (
          <QuestionsProductInfo
            product={product}
            priceList={prices}
            title={
              totalCount > 0
                ? `${totalCount} ${declOfNum(totalCount, ["вопрос", "вопроса", "вопросов"])}`
                : "Вопросы"
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
        ListHeaderComponentStyle={{ rowGap: 8 }}
        ListHeaderComponent={<View>{id && <QuestionsForm id={id} />}</View>}
        ListEmptyComponent={
          !loading && data.length === 0 ? (
            <NotContent
              title="Пока нет вопросов"
              subTitle="Станьте первым, кто задаст вопрос о товаре"
            />
          ) : undefined
        }
        renderItem={({ item }) => <QuestionCard backgroundColor="white" item={item} />}
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
