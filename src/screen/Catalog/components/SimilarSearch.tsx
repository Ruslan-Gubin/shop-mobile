import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { declOfNum } from "../../../shared/helpers/declOfNum";
import { SearchSvg } from "../../../shared/svg/SearchSvg";
import type { SearchModel } from "../../../shared/types/search";

type Props = {
  similarSearch: SearchModel[];
  onSelect: (text: string) => void;
  count: number;
  search?: string;
};

export const SimilarSearch = (props: Props) => {
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchLine}>
        {props.search ? (
          <Text numberOfLines={1} style={styles.searchTitle}>
            {props.search}
          </Text>
        ) : null}
        {props.count > 0 ? (
          <Text numberOfLines={1} style={styles.searchCount}>
            {`Найдено ${props.count} ${declOfNum(props.count, ["товар", "товара", "товаров"])}`}
          </Text>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={132}
        contentContainerStyle={styles.list}
      >
        {props.similarSearch.map((item) => (
          <Pressable key={item.id} style={styles.item} onPress={() => props.onSelect(item.text)}>
            <SearchSvg size={14} fill="rgb(169, 168, 176)" />
            <Text style={styles.itemText} numberOfLines={1}>
              {item.text}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    paddingTop: 56,
    rowGap: 8,
  },
  searchLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#242424",
    flexShrink: 1,
  },
  searchCount: {
    fontSize: 13,
    color: "#868695",
    flexShrink: 1,
  },
  list: {
    columnGap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    backgroundColor: "#f1f1f5",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 44,
  },
  itemText: {
    fontSize: 14,
    color: "#242424",
  },
});

