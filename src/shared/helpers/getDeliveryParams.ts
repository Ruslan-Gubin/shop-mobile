import type { Feature, Polygon } from "geojson";
import type { AddressItem } from "../../store/checkout/types";
import { findMapSector } from "./findMapSector";

export const getDeliveryParams = (
  method_receipt: "courier" | "pickup",
  address: AddressItem | null,
  features: Feature<Polygon, { id: number; color: string; price: number; min_sum: number }>[],
) => {
  let price = 0;
  let min_sum = 0;

  if (
    method_receipt === "courier" &&
    address !== null &&
    typeof address.lng === "number" &&
    typeof address.lat === "number"
  ) {
    const sector = findMapSector(features, address.lng, address.lat);

    if (typeof sector?.properties?.price === "number") {
      price = sector.properties.price;
    }

    if (typeof sector?.properties?.min_sum === "number") {
      min_sum = sector.properties.min_sum;
    }
  }

  return { price, min_sum };
};
