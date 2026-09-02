import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SearchSvg } from "../../../shared/svg/SearchSvg";
import type { SearchModel } from "../../../shared/types/search";

type Props = {
  similarSearch: SearchModel[];
  onSelect: (text: string) => void;
};

export const SimilarSearch = (props: Props) => {
  if (props.similarSearch.length === 0) {
    return null;
  }

  return (
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
  );
};

const styles = StyleSheet.create({
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