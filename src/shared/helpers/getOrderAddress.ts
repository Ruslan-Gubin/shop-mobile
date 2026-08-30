import type { AddressItem } from "../../store/checkout/types";

export const getOrderAddress = (
  defaultCenter: { lng: number; lat: number },
  pickupAddress: AddressItem[],
  courierAddress: AddressItem[],
  method_receipt: "pickup" | "courier",
  activePickup: { lng: number; lat: number } | null,
  activeCourier: { lng: number; lat: number } | null,
) => {
  let address: AddressItem | null = null;

  if (method_receipt === "pickup") {
    if (activePickup) {
      const findActiveAddress = (pickupAddress || []).find(
        (el) => el.lng === activePickup.lng && el.lat === activePickup.lat,
      );

      if (findActiveAddress) {
        address = findActiveAddress;
      }
    } else {
      const findDefault = (pickupAddress || []).find(
        (el) =>
          typeof el.lng === "number" &&
          el.lng === defaultCenter.lng &&
          typeof el.lat === "number" &&
          el.lat === defaultCenter.lat,
      );

      if (findDefault) {
        address = findDefault;
      }
    }
  } else {
    if (activeCourier) {
      const findActiveAddress = courierAddress.find(
        (el) => el.lng === activeCourier.lng && el.lat === activeCourier.lat,
      );

      if (findActiveAddress) {
        address = findActiveAddress;
      }
    } else if (!activeCourier && courierAddress.length > 0) {
      const findFirst = (pickupAddress || []).find(
        (el) => typeof el.lng === "number" && typeof el.lat === "number",
      );
      if (findFirst) {
        address = findFirst;
      }
    }
  }

  return address;
};