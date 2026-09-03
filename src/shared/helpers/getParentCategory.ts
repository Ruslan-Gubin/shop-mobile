import type { CategoryModel } from "../types/category";

export const getParentCategory = (
  categories: CategoryModel[],
  id: number,
): CategoryModel | null => {
  let category: CategoryModel | null = null;

  for (let i = 0; i < categories.length; i++) {
    const currentCategory = categories[i];
    const hasChildren = currentCategory.children.length > 0;

    if (currentCategory.children.some((el) => el.id === id)) {
      category = currentCategory;
      break;
    }

    if (hasChildren) {
      const findChildren = getParentCategory(currentCategory.children, id);
      if (findChildren) {
        category = findChildren;
        break;
      }
    }
  }

  return category;
};
