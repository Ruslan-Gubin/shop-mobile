import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CategoryModel } from "../../../shared/types/category";
import { ArrowBackIcon } from "../../../shared/svg/ArrowBackIcon";

type Props = {
  categories: CategoryModel[];
  onSelect: (category: CategoryModel) => void;
};

export const CategoryList = (props: Props) => {
  return (
    <View style={styles.root}>
      {props.categories.map((category) => (
        <Pressable
          key={category.id}
          style={styles.item}
          onPress={() => props.onSelect(category)}
          accessibilityRole="button"
        >
          <Text style={styles.itemText}>{category.name}</Text>
          {category.product_count > 0 && (
            <Text style={styles.itemCount}>({category.product_count})</Text>
          )}
          {category.children.length > 0 && (
            <View style={styles.chevron}>
              <ArrowBackIcon fill="gray" size={18} />
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
    backgroundColor: "white",
    rowGap: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f5",
    columnGap: 8,
  },
  itemText: {
    fontSize: 15,
    color: "#242424",
    flex: 1,
  },
  itemCount: {
    fontSize: 13,
    color: "#868695",
  },
  chevron: {
    transform: [{ rotate: "270deg" }],
  },
});
