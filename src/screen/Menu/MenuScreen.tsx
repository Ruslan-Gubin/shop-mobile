import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getParentCategory } from "../../shared/helpers/getParentCategory";
import type { CategoryModel } from "../../shared/types/category";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { SearchNavigateButton } from "../../widgets/home/search-navigate-button/SearchNavigateButton";
import { CategoryList } from "./components/CategoryList";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Menu">;
};

export const MenuScreen = (props: Props) => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel | null>(null);

  const fetchCategoriesEvent = useEffectEvent(() => {
    setLoading(true);
    fetchService
      .get<CategoryModel[]>({ url: "category/categories" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setCategories(response.data.filter((el) => el.parent_id === null));
        }
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    fetchCategoriesEvent();
  }, []);

  const handleSelectCategory = (category: CategoryModel) => {
    if (category.children.length > 0) {
      setSelectedCategory(category);
    } else {
      props?.navigation?.push("Catalog", { category: category.id });
    }
  };

  const handleBackToMenu = () => {
    if (selectedCategory !== null) {
      const parentCategory = getParentCategory(categories, selectedCategory.id);
      setSelectedCategory(parentCategory);
    }
  };

  return (
    <View style={styles.root}>
      {!selectedCategory && (
        <SearchNavigateButton onPress={() => props.navigation?.push("Search")} />
      )}

      {selectedCategory?.name && selectedCategory.children.length > 0 && (
        <PageHeader title={selectedCategory.name} onBack={handleBackToMenu} />
      )}

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#a73afd" />
        </View>
      )}

      <CategoryList
        categories={
          selectedCategory && selectedCategory.children.length > 0
            ? selectedCategory.children
            : categories
        }
        onSelect={handleSelectCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
});
