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
    const hasActivePickup =
      typeof activePickup?.lat === "number" &&
      activePickup?.lat > 0 &&
      typeof activePickup?.lng === "number" &&
      activePickup?.lng > 0;

    const findActiveAddress = hasActivePickup
      ? (pickupAddress || []).find(
          (el) => el.lng === activePickup.lng && el.lat === activePickup.lat,
        )
      : null;

    if (findActiveAddress) {
      address = findActiveAddress;
    }
  } else {
    const hasActiveCourier =
      typeof activeCourier?.lat === "number" &&
      activeCourier?.lat > 0 &&
      typeof activeCourier?.lng === "number" &&
      activeCourier?.lng > 0;

    if (hasActiveCourier) {
      const findActiveAddress = courierAddress.find(
        (el) => el.lng === activeCourier.lng && el.lat === activeCourier.lat,
      );

      if (findActiveAddress) {
        address = findActiveAddress;
      }
    }
  }

  if (!address) {
    const findDefault = (pickupAddress || []).find(
      (el) =>
        typeof el.lng === "number" &&
        el.lng === defaultCenter.lng &&
        typeof el.lat === "number" &&
        el.lat === defaultCenter.lat,
    );

    if (findDefault) {
      address = findDefault;
    } else {
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

