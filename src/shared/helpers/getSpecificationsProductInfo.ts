import type {
  ProductModel,
  ProductSpecificationModel,
} from '../types/products';

export const getSpecificationsProductInfo = (
  product: ProductModel,
  productSpecifications: ProductSpecificationModel[],
) => {
  const specifications: { label: string; value: string }[] = [];

  if (
    typeof product.product_type === 'string' &&
    product.product_type.length > 0
  ) {
    specifications.push({
      label: 'Вид товара',
      value: product.product_type,
    });
  }

  if (typeof product.equipment === 'string' && product.equipment.length > 0) {
    specifications.push({
      label: 'В состав входит',
      value: product.equipment,
    });
  }

  if (typeof product.country === 'string' && product.country.length > 0) {
    specifications.push({
      label: 'Страна производитель',
      value: product.country,
    });
  }

  for (let i = 0; i < productSpecifications.length; i++) {
    const label = productSpecifications[i].specification.name;
    const value = productSpecifications[i].value;

    const isValidLabel =
      typeof label === 'string' &&
      label.length > 0 &&
      label !== 'Вид товара' &&
      label !== 'В состав входит' &&
      label !== 'Страна производитель';

    const isValidValue = typeof value === 'string' && value.length > 0;

    if (isValidLabel && isValidValue) {
      specifications.push({ label, value });
    }
  }

  return specifications;
};
