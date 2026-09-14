import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { declOfNum } from "../../shared/helpers/declOfNum";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../shared/types/products";
import type { QuestionModel } from "../../shared/types/question";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { NotContent } from "../../widgets/not-content/NotContent";
import { QuestionCard } from "../../widgets/question/QuestionCard";
import type { PriceItem } from "../ProductInfo/types";
import { QuestionsProductInfo } from "./components/QuestionsProductInfo";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "UserProductQuestions">;
  route?: {
    key: string;
    name: string;
    params?: { id: number };
  };
};

export const UserProductQuestionsScreen = (props: Props) => {
  const id = props.route?.params?.id;

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isProductError, setIsProductError] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchProductEvent = useEffectEvent((productId: number) => {
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

  const fetchPricesEvent = useEffectEvent((productId: number) => {
    fetchService
      .get<PriceItem[]>({ url: `product-price/for-user/${productId}` })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setPrices(response.data);
        }
      });
  });

  useEffect(() => {
    if (typeof id === "number") {
      fetchProductEvent(id);
      fetchPricesEvent(id);
    }
  }, [id]);

  const { data, isHasMore, loadMore, loading } = useInfiniteScroll({
    limit: 30,
    fetchData: (page: number) =>
      fetchService
        .get<{ questions: QuestionModel[]; totalCount: number; paginationPage: number }>({
          url: `product-question/my-questions-from-product/${id}`,
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
            title={
              totalCount > 0
                ? `${totalCount} ${declOfNum(totalCount, ["вопрос", "вопроса", "вопросов"])}`
                : "Мои вопросы"
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
        ListEmptyComponent={
          !loading && data.length === 0 ? (
            <NotContent
              title="Нет вопросов"
              subTitle="Вы пока не задавали вопросов к этому товару"
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
  listContent: {
    paddingTop: 8,
    rowGap: 8,
    paddingBottom: 8,
  },
  footerLoader: {
    paddingVertical: 12,
    alignItems: "center",
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
