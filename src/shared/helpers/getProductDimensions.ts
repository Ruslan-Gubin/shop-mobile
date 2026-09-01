import type { ProductModel } from '../types/products';

export const getProductDimensions = (product: ProductModel | null) => {
  const result: { label: string; value: string }[] = [];

  if (product) {
    if (typeof product.width === 'number') {
      result.push({ label: 'Ширина', value: `${product.width} см.` });
    }

    if (typeof product.height === 'number') {
      result.push({ label: 'Высота', value: `${product.height} см.` });
    }

    if (typeof product.length === 'number') {
      result.push({ label: 'Длина', value: `${product.length} см.` });
    }

    if (typeof product.weight === 'number') {
      result.push({ label: 'Вес', value: `${product.weight} кг.` });
    }
  }

  return result;
};
