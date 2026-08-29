import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import type { ProductModel } from "../../../shared/types/products";
import { ErrorAlert } from "../../../shared/ui/ErrorAlert/ErrorAlert";
import { recentStore } from "../../../store/recent/store";
import { HorizontalProductList } from "../horizontal-product-list/HorizontalProductList";

type Props = {
  isHasNavigateSeeAll?: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const ProductRecent = (props: Props) => {
  const [data, setData] = useState<ProductModel[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const defaultErrorMessage = "Не удалось получить список просмотренных товаров";

  const recent = recentStore((store) => store.items);
  const recentIds = Object.values(recent)
    .map((r) => r)
    .join(",");

  const fetchRecentEvent = useEffectEvent((recentIds: string) => {
    if (recentIds.length > 0) {
      fetchService
        .get<ProductModel[]>({
          url: "product/by-ids",
          params: { ids: recentIds },
        })
        .then((response) => {
          if (response.status === "success" && Array.isArray(response.data)) {
            setData(response.data);
          } else if (response.status === "error") {
            throw response.message || defaultErrorMessage;
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultErrorMessage);

          setErrorMessage(message);

          Alert.alert("Ошибка", message, [
            { text: "Отмена", style: "default" },
            {
              text: "Повторить",
              isPreferred: true,
              onPress: () => {
                fetchRecentEvent(recentIds);
                setErrorMessage("");
              },
            },
          ]);
        });
    }
  });

  useEffect(() => {
    fetchRecentEvent(recentIds);
  }, [recentIds]);

  return (
    <>
      {data.length > 0 && (
        <HorizontalProductList
          navigation={props.navigation}
          title="Вы смотрели"
          data={data}
          onSeeAll={
            data.length > 6 && props.isHasNavigateSeeAll
              ? () => props?.navigation?.push("Recent")
              : undefined
          }
        />
      )}
      {errorMessage.length > 0 && data.length === 0 && <ErrorAlert message={errorMessage} />}
    </>
  );
};
