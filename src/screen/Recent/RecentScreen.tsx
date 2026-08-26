import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { ProductCard } from "../../widgets/product/product-card/ProductCard";
import { getWidthCard } from "../../shared/helpers/getWidthCard";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Search">;
  route?: {
    key: string;
    name: string;
    params?: Record<string, string>;
  };
};

export const RecentScreen = (props: Props) => {
  const [popularList, setPopularList] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [findItems, setFindItems] = useState<string[]>([]);
  const [recentData, setRecentData] = useState<ProductModel[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const history = searchStore((store) => store.history);
  const debounceFn = useDebounce();
  const recent = recentStore((state) => state.items);
  const width = getWidthCard(Dimensions.get("window").width, 0, 4, 2);

  const fetchPopularSearch = () => {
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
            params: { ids: recent.toString() },
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
    fetchPopularSearch();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {props.navigation && (
          <Pressable onPress={() => props.navigation?.goBack()}>
            <Text style={styles.seeAll}>{"<"} Назад </Text>
          </Pressable>
        )}
        <Text style={styles.title}>Вы смотрели</Text>
      </View>

      {recentData.length > 0 && (
        <FlatList
          data={recentData}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={{ columnGap: 4 }}
          onEndReachedThreshold={1}
          renderItem={({ item, index }) => {
            return (
              <ProductCard
                width={width}
                priceList={item.price_list}
                index={index}
                photos={item.photos}
                accounting={true}
                available={item.available}
                id={item.id}
                name={item.name}
                rating={item.rating}
                reviewCount={item.review_count}
                brand_name={item.brand_name}
                navigation={props.navigation}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    rowGap: 16,
    backgroundColor: "white",
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    paddingInline: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },

  seeAll: {
    fontSize: 12,
    fontWeight: "400",
    color: "#9a1cc6",
  },

  listContent: {
    paddingBottom: 20,
    rowGap: 12,
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
