export const getLargePrice = (priceList: { price: number; minQuantity: number }[]) => {
  let price = 0;

  if (priceList.length > 0) {
    for (let i = 0; i < priceList.length; i++) {
      const currentPrice = priceList[i].price;

      if (!price || (typeof currentPrice === "number" && price < currentPrice)) {
        price = currentPrice;
      }
    }
  }

  return price;
};
