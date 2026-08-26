export const getCurrentPrice = (
  selectCount: number,
  priceList: { price: number; minQuantity: number }[],
) => {
  let price = 0;

  if (priceList.length === 1 && priceList[0] && typeof priceList[0].price === "number") {
    price = priceList[0].price;
  } else if (priceList.length > 1) {
    for (let i = 0; i < priceList.length; i++) {
      const itemPrice = priceList[i].price;
      const minQuantity = priceList[i].minQuantity;

      if (
        selectCount >= minQuantity &&
        ((itemPrice && !price) || (itemPrice && price && itemPrice < price))
      ) {
        price = itemPrice;
      }
    }
  }

  return price;
};
