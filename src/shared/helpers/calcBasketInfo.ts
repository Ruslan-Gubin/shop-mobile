import type { CartDiscountModel } from "../types/cart-discount";
import type { ProductModel } from "../types/products";
import type { PromotionModel } from "../types/promotion";
import { getCurrentPrice } from "./getCurrentPrice";
import { getLargePrice } from "./getLargePrice";

export const calcBasketInfo = (
  selected: number[],
  basket: Record<string, number>,
  basketProducts: ProductModel[],
  cartDiscounts: CartDiscountModel[],
  promotions: PromotionModel[],
) => {
  let productCount = 0;
  let total = 0;
  let largeTotal = 0;
  let totalDiscount = 0;
  let quantityDiscount = 0;

  let cartDiscountPercent = 0;
  let cartDiscount = 0;
  let cartDiscountName = "";

  let promotionPercent = 0;
  let promotionDiscount = 0;
  let promotionName = "";

  if (selected && basket) {
    for (let i = 0; i < selected.length; i++) {
      const basketItemCount = basket[selected[i]];
      const priceList = basketProducts.find((el) => el.id === selected[i])?.price_list;

      if (priceList) {
        const currentPrice = getCurrentPrice(basketItemCount || 1, priceList);
        const largePrice = getLargePrice(priceList);

        if (
          typeof currentPrice === "number" &&
          currentPrice > 0 &&
          typeof basketItemCount === "number" &&
          basketItemCount > 0
        ) {
          productCount += basketItemCount;
          total += basketItemCount * currentPrice;
          largeTotal += basketItemCount * largePrice;
        }
      }
    }

    if (total > 0 && cartDiscounts.length > 0) {
      for (let i = 0; i < cartDiscounts.length; i++) {
        const minSum = cartDiscounts[i].min_sum;
        const percent = cartDiscounts[i].percent;

        if (total >= minSum && cartDiscountPercent < percent) {
          cartDiscountPercent = percent;
          cartDiscountName = cartDiscounts[i].name;
        }
      }
    }

    if (total > 0 && promotions.length > 0) {
      for (let i = 0; i < promotions.length; i++) {
        const percent = promotions[i].percent;

        if (promotionPercent < percent) {
          promotionPercent = percent;
          promotionName = promotions[i].name;
        }
      }
    }

    quantityDiscount = largeTotal > total ? largeTotal - total : 0;

    if (cartDiscountPercent > 0 && cartDiscountPercent > promotionPercent) {
      cartDiscount = (total * cartDiscountPercent) / 100;
      total -= cartDiscount;
    } else if (promotionPercent > 0 && promotionPercent >= cartDiscountPercent) {
      promotionDiscount = (total * promotionPercent) / 100;
      total -= promotionDiscount;
    }

    totalDiscount = largeTotal > total ? largeTotal - total : 0;
  }

  return {
    productCount,
    total,
    totalDiscount,
    quantityDiscount,
    cartDiscount,
    cartDiscountName,
    promotionDiscount,
    promotionName,
  };
};
