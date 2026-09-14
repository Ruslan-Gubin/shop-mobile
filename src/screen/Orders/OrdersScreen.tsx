import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";
import type { OrderModel } from "../../shared/types/order";
import { ErrorAlert } from "../../shared/ui/ErrorAlert/ErrorAlert";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { NotContent } from "../../widgets/not-content/NotContent";
import { OrderCard } from "./components/OrderCard";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Orders">;
  route?: {
    key: string;
    name: string;
    params?: { view?: "orders" | "purchases" | "waiting" };
  };
};

export const OrdersScreen = (props: Props) => {
  const [error, setError] = useState<string>("");
  const limit = 30;
  const defaultError = "Не удалось загрузить заказы";
  const view = props.route?.params?.view || "orders";

  const titleTranslate = {
    orders: "Заказы",
    purchases: "Покупки",
    waiting: "Лист ожидания",
  };

  const { data, isHasMore, loadMore, loading, reloadAfterError, total } = useInfiniteScroll({
    limit,
    fetchData: (page: number) =>
      fetchService
        .get<{ orders: OrderModel[]; paginationPage: string; totalCount: number }>({
          url: "orders/all-client",
          params: {
            limit: String(limit),
            page: page ? String(page) : "1",
            view,
          },
        })
        .then((response) => {
          if (response.status === "success" && response.data) {
            return { data: response.data.orders, total: response.data.totalCount };
          } else {
            throw response.message;
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultError);

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
  });

  return (
    <View style={styles.root}>
      <PageHeader
        title={titleTranslate[view] || "Заказы"}
        onBack={() => props.navigation?.goBack()}
      />
      {error.length > 0 && <ErrorAlert message={error} />}
      {data.length === 0 && total === 0 && !loading && (
        <NotContent
          title="Заказов пока нет"
          subTitle="Перейдите в корзину что бы оформить заказ."
          navigateText="Перейти в корзину"
          onNavigate={() => props.navigation?.navigate("BasketStack")}
        />
      )}
      <FlatList
        data={data}
        contentContainerStyle={styles.listContent}
        onEndReached={() => isHasMore && !error && loadMore()}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard order={item} navigation={props.navigation} />}
        ListFooterComponent={
          <View style={styles.footerListPadding}>
            {loading && <ActivityIndicator size="small" color="#a73afd" />}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#f7f8fa",
    paddingBottom: 8,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 8,
    rowGap: 8,
  },
  footerListPadding: {
    height: 22,
  },
});
