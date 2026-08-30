import type { AddressItem } from "../../store/checkout/types";

export const getInitCenter = (
  defaultCenter: { lng: number; lat: number },
  pickupAddress: AddressItem[],
  courierAddress: AddressItem[],
  activePickup: { lng: number; lat: number } | null,
  activeCourier: { lng: number; lat: number } | null,
  method_receipt: "pickup" | "courier",
): { lng: number; lat: number } => {
  let lng = defaultCenter.lng;
  let lat = defaultCenter.lat;

  if (method_receipt === "pickup" && activePickup) {
    lng = activePickup.lng;
    lat = activePickup.lat;
  } else if (method_receipt === "courier" && activeCourier) {
    lng = activeCourier.lng;
    lat = activeCourier.lat;
  } else if (method_receipt === "pickup" && pickupAddress.length > 0) {
    const findAddress = pickupAddress.find(
      (el) => typeof el.lng === "number" && typeof el.lat === "number",
    );

    if (findAddress) {
      lng = findAddress.lng;
      lat = findAddress.lat;
    }
  } else if (method_receipt === "courier" && courierAddress.length > 0) {
    const findAddress = pickupAddress.find(
      (el) => typeof el.lng === "number" && typeof el.lat === "number",
    );

    if (findAddress) {
      lng = findAddress.lng;
      lat = findAddress.lat;
    }
  }

  return { lng, lat };
};