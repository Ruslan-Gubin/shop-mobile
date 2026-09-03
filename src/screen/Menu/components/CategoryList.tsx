import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowBackIcon } from "../../../shared/svg/ArrowBackIcon";
import type { CategoryModel } from "../../../shared/types/category";

type Props = {
  categories: CategoryModel[];
  onSelect: (category: CategoryModel) => void;
};

export const CategoryList = (props: Props) => {
  return (
    <FlatList
      data={props.categories}
      style={styles.root}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          style={styles.item}
          onPress={() => props.onSelect(item)}
          accessibilityRole="button"
        >
          <Text style={styles.itemText}>{item.name}</Text>
          {item.children.length > 0 && (
            <View style={styles.chevron}>
              <ArrowBackIcon fill="gray" size={18} />
            </View>
          )}
        </Pressable>
      )}
    >
      {props.categories.map((category) => (
        <Pressable
          key={category.id}
          style={styles.item}
          onPress={() => props.onSelect(category)}
          accessibilityRole="button"
        >
          <Text style={styles.itemText}>{category.name}</Text>
          {category.children.length > 0 && (
            <View style={styles.chevron}>
              <ArrowBackIcon fill="gray" size={18} />
            </View>
          )}
        </Pressable>
      ))}
    </FlatList>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingBlock: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f5",
    columnGap: 8,
  },
  itemText: {
    color: "#242424",
    flex: 1,
  },
  chevron: {
    transform: [{ rotate: "180deg" }],
  },
});
