import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import type { ProductModel } from "../../shared/types/products";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { NotContent } from "../../widgets/not-content/NotContent";
import { SegmentControl } from "./components/SegmentControl";
import { UserProductCard } from "./components/UserProductCard";

type SegmentKey = "waiting" | "reviews" | "questions";

const SEGMENTS = [
  { value: "waiting", label: "Ждут отзыва" },
  { value: "reviews", label: "Отзывы" },
  { value: "questions", label: "Вопросы" },
];

const EMPTY_STATES: Record<SegmentKey, { title: string; subTitle: string }> = {
  waiting: {
    title: "Нет товаров, ожидающих отзыва",
    subTitle: "Купленные товары, которые вы ещё не оценили, появятся здесь.",
  },
  reviews: {
    title: "Вы пока не оставляли отзывов",
    subTitle: "Ваши отзывы на купленные товары появятся здесь.",
  },
  questions: {
    title: "Вы пока не задавали вопросов",
    subTitle: "Ваши вопросы о товарах появятся здесь.",
  },
};

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "UserReviews">;
};

export const UserReviewsScreen = (props: Props) => {
  const [activeValue, setActiveValue] = useState<SegmentKey>("waiting");
  const [isLoadingFirstContent, setIsLoadingFirstContent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const limit = 30;

  const TAB_SOURCES: Record<SegmentKey, string> = {
    waiting: "product/can-review",
    reviews: "product/reviewed",
    questions: "product/questions",
  };

  const source = TAB_SOURCES[activeValue];
  const empty = EMPTY_STATES[activeValue];

  const { data, isHasMore, loadMore, loading, reloadAfterError, total, reload } = useInfiniteScroll(
    {
      limit,
      fetchData: (page: number) =>
        fetchService
          .get<{ products: ProductModel[]; paginationPage: number; totalCount: number }>({
            url: source,
            params: {
              limit: String(limit),
              page: page ? String(page) : "1",
            },
          })
          .then((response) => {
            if (response.status === "success" && response.data) {
              return { data: response.data.products, total: response.data.totalCount };
            } else {
              throw response.message;
            }
          })
          .catch((err) => {
            const message = getMessageError(err, "Не удалось загрузить товары");

            setError(message);

            Alert.alert("Ошибка", message, [
              { text: "Отмена", style: "default" },
              {
                text: "Повторить",
                isPreferred: true,
                onPress: () => {
                  reloadAfterError();
                  setError("");
                },
              },
            ]);

            return { data: [], total: 0 };
          }),
    },
  );

  const reloadEvent = useEffectEvent(() => {
    if (isLoadingFirstContent) {
      reload();
    } else {
      setIsLoadingFirstContent(true);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <activeValue>
  useEffect(() => {
    reloadEvent();
  }, [activeValue]);

  const handleChangeKey = (key: string) => {
    if (key !== activeValue && (key === "waiting" || key === "reviews" || key === "questions")) {
      setActiveValue(key);
    }
  };

  return (
    <View style={styles.root}>
      <PageHeader title="Отзывы и вопросы" onBack={() => props.navigation?.goBack()} />

      <View style={styles.segmentCard}>
        <SegmentControl options={SEGMENTS} value={activeValue} onChange={handleChangeKey} />
      </View>

      <View style={styles.listRoot}>
        {error.length > 0 && <ErrorAlert message={error} />}
        <FlatList
          data={data}
          contentContainerStyle={styles.listContent}
          onEndReached={() => isHasMore && !error && loadMore()}
          onEndReachedThreshold={1}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UserProductCard
              id={item.id}
              name={item.name}
              description={item.description}
              brand_name={item.brand_name}
              photos={item.photos}
              activeTab={activeValue}
              navigation={props.navigation}
            />
          )}
          ListEmptyComponent={
            !loading && data.length === 0 && total === 0 ? (
              <NotContent title={empty.title} subTitle={empty.subTitle} />
            ) : undefined
          }
          ListFooterComponent={
            <View style={styles.footerListPadding}>
              {loading && <ActivityIndicator size="small" color="#a73afd" />}
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    rowGap: 8,
  },
  segmentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  listRoot: {
    flex: 1,
  },
  listContent: {
    rowGap: 8,
  },
  footerListPadding: {
    height: 8,
  },
});
