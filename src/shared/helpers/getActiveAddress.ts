import type { AddressItem } from "../../store/checkout/types";

export const getActiveAddress = (
  pickupAddress: AddressItem[],
  courierAddress: AddressItem[],
  initCenter: { lng: number; lat: number },
  method_receipt: "pickup" | "courier",
  activePickup: { lng: number; lat: number } | null,
  activeCourier: { lng: number; lat: number } | null,
): { lng: number; lat: number } | null => {
  let lng = initCenter.lng;
  let lat = initCenter.lat;

  if (method_receipt === "pickup") {
    if (
      activePickup &&
      typeof activePickup.lng === "number" &&
      typeof activePickup.lat === "number"
    ) {
      lng = activePickup.lng;
      lat = activePickup.lat;
    } else {
      const defaultAddress = pickupAddress.find(
        (el) =>
          typeof el.lng === "number" &&
          el.lng === initCenter.lng &&
          typeof el.lat === "number" &&
          el.lat === initCenter.lat,
      );
      if (defaultAddress) {
        lng = defaultAddress.lng;
        lat = defaultAddress.lat;
      }
    }
  }

  if (method_receipt === "courier" && activeCourier) {
    if (typeof activeCourier.lng === "number" && typeof activeCourier.lat === "number") {
      lng = activeCourier.lng;
      lat = activeCourier.lat;
    } else {
      const findAddress = courierAddress.find(
        (el) => typeof el.lng === "number" && typeof el.lat === "number",
      );

      if (findAddress) {
        lng = findAddress.lng;
        lat = findAddress.lat;
      }
    }
  }

  return { lng, lat };
};