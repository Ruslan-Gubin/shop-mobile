import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { CloseSvg } from "../../shared/svg/CloseSvg";
import { SearchSvg } from "../../shared/svg/SearchSvg";
import type { ProductModel } from "../../shared/types/products";
import type { SearchModel } from "../../shared/types/search";
import { recentStore } from "../../store/recent/store";
import { searchAdapter } from "../../store/search/adapter";
import { searchStore } from "../../store/search/store";
import { HorizontalProductList } from "../../widgets/product/horizontal-product-list/HorizontalProductList";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Search">;
  route?: {
    key: string;
    name: string;
    params?: Record<string, string>;
  };
};

export const SearchScreen = (props: Props) => {
  const [popularList, setPopularList] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [findItems, setFindItems] = useState<string[]>([]);
  const [recentData, setRecentData] = useState<ProductModel[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const history = searchStore((store) => store.history);
  const debounceFn = useDebounce();
  const recent = recentStore((state) => state.items);

  const fetchInitData = () => {
    fetchService
      .get<SearchModel[]>({
        url: "search/popular",
        params: { limit: "7" },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setPopularList(response.data.map((el) => el.text));
        }

        fetchService
          .get<ProductModel[]>({
            url: "product/by-ids",
            params: { ids: recent },
          })
          .then((response) => {
            console.log(response);
            if (response.status === "success" && Array.isArray(response.data)) {
              setRecentData(response.data);
            }
          });
      });
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchSuggestions = (value: string) => {
    fetchService
      .get<SearchModel[]>({
        url: "search",
        params: { text: value, limit: "7" },
      })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setFindItems(response.data.map((el) => el.text));
        } else {
          throw response.message || "Не удалось получить подходящие варианты по поиску";
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось получить подходящие варианты по поиску");
        setIsError(true);

        Alert.alert("Ошибка", message, [
          {
            text: "Отмена",
            style: "default",
            onPress: () => {
              setIsError(false);
            },
          },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              fetchSuggestions(value);
              setIsError(false);
            },
          },
        ]);
      });
  };

  const handleChangeSearch = (value: string) => {
    if (!isError) {
      setSearch(value);

      if (value.length >= 1) {
        debounceFn(() => fetchSuggestions(value));
      }
    }
  };

  const handleClickHistoryItem = (value: string) => {
    if (props.navigation) {
      setSearch(value);
      searchAdapter.sortedHistory(value);
      props.navigation.push("Catalog", { search: value });
    }
  };

  const handleCancelSearch = () => {
    if (props.navigation) {
      setSearch("");
      props.navigation.push("Home");
    }
  };

  const handleDeleteHistoryItem = (value: string) => searchAdapter.deleteHistory(value);
  const handleResetHistory = () => searchAdapter.resetHistory();

  return (
    <View style={styles.root}>
      <View style={styles.inputLine}>
        <View style={styles.inputContainer}>
          <SearchSvg size={18} fill="gray" />
          <TextInput
            value={search}
            onChangeText={(value) => handleChangeSearch(value)}
            style={styles.input}
            placeholder="Поиск"
            readOnly={isError}
          />
        </View>

        <Pressable onPress={handleCancelSearch}>
          <Text style={styles.inputCancelText}>Отменить</Text>
        </Pressable>
      </View>

      {search.length === 0 && history.length > 0 && (
        <View style={styles.mySearchContainer}>
          <View style={styles.headerLine}>
            <Text style={styles.headerLineTitle}>Вы искали</Text>
            <Pressable onPress={handleResetHistory}>
              <Text style={styles.headerLineButtonText}>Очистить</Text>
            </Pressable>
          </View>

          <View style={styles.mySearchList}>
            {history.map((item, index) => (
              <View key={`${item}_${index}`} style={styles.searchItem}>
                <Pressable
                  style={styles.buttonCancelItem}
                  onPress={() => handleClickHistoryItem(item)}
                >
                  <Text style={styles.searchItemText}>{item}</Text>
                </Pressable>
                <Pressable
                  style={styles.buttonCancelItem}
                  onPress={() => handleDeleteHistoryItem(item)}
                >
                  <CloseSvg size={12} fill="gray" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {search.length === 0 && history.length === 0 && popularList.length > 0 && (
        <View style={styles.mySearchContainer}>
          <View style={styles.headerLine}>
            <Text style={styles.headerLineTitle}>Часто ищут</Text>
          </View>

          <View style={styles.mySearchList}>
            {popularList.map((item, index) => (
              <View key={`${item}_${index}`} style={styles.searchItem}>
                <Pressable
                  style={styles.buttonCancelItem}
                  onPress={() => handleClickHistoryItem(item)}
                >
                  <Text style={styles.searchItemText}>{item}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {search.length > 0 && findItems.length > 0 && (
        <View>
          {findItems.map((item, index) => (
            <View key={`${item}_${index}`} style={styles.findSearchItem}>
              <Pressable style={styles.findItemButton} onPress={() => handleClickHistoryItem(item)}>
                <SearchSvg size={18} fill="gray" />
                <Text style={styles.searchItemText}>{item}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {search.length === 0 && recentData.length > 0 && (
        <HorizontalProductList
          navigation={props.navigation}
          title="Вы смотрели"
          data={recentData}
          onSeeAll={recent.length > 6 ? () => props?.navigation?.push("Recent") : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingInline: 12,
    rowGap: 16,
    backgroundColor: "white",
    flex: 1,
  },
  inputLine: {
    columnGap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: "#f1f1f5",
    flex: 1,
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 6,
    paddingInline: 8,
    columnGap: 12,
  },
  input: {
    flex: 1,
  },
  inputCancelText: {
    color: "#9a1cc6",
    fontWeight: 500,
    fontSize: 13,
  },
  headerLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  headerLineTitle: {
    fontSize: 14,
    fontWeight: 500,
  },
  headerLineButtonText: {
    fontSize: 12,
    fontWeight: 300,
  },
  mySearchContainer: {
    rowGap: 12,
  },
  mySearchList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  searchItem: {
    backgroundColor: "#f1f1f5",
    paddingLeft: 8,
    paddingRight: 4,
    paddingBlock: 4,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 2,
  },
  searchItemText: {
    fontSize: 13,
    fontWeight: 300,
  },
  buttonCancelItem: {
    padding: 4,
  },
  findSearchItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f5",
  },
  findItemButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    paddingBlock: 12,
  },
});
