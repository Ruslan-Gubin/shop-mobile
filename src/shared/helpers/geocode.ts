import { CONFIG_APP } from "../config/config";

type GeoFeature = {
  properties?: {
    name?: string;
    feature_type?: string;
    context?: { place?: { name?: string } };
    coordinates?: { longitude?: number; latitude?: number };
  };
};

type GeoResponse = {
  features?: GeoFeature[];
};

export type GeocodeResult = {
  lng: number;
  lat: number;
  name: string;
  place: string;
};

const extractFeature = (response: GeoResponse, findAddress?: boolean): GeoFeature | undefined => {
  const features = Array.isArray(response.features) ? response.features : [];

  if (findAddress) {
    return features.find((el) => el.properties?.feature_type === "address");
  }

  return features[0];
};

const toResult = (feature: GeoFeature, lng: number, lat: number): GeocodeResult => {
  const name = feature.properties?.name;
  const place = feature.properties?.context?.place?.name;
  const longitude = feature.properties?.coordinates?.longitude;
  const latitude = feature.properties?.coordinates?.latitude;

  if (
    typeof name === "string" &&
    name.length > 0 &&
    typeof place === "string" &&
    place.length > 0 &&
    typeof longitude === "number" &&
    typeof latitude === "number"
  ) {
    return { lng, lat, name, place };
  }

  throw new Error("Not found address");
};

export const fetchForwardAction = async (address: string): Promise<GeocodeResult> => {
  const response = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&access_token=${CONFIG_APP.MAPBOX_ACCESS_TOKEN}&language=ru&limit=1`,
  );
  const data: GeoResponse = await response.json();
  const findFeature = extractFeature(data);

  if (!findFeature) {
    throw new Error("Not found address");
  }

  return toResult(
    findFeature,
    findFeature.properties?.coordinates?.longitude ?? 0,
    findFeature.properties?.coordinates?.latitude ?? 0,
  );
};

export const fetchReverseAction = async (lng: number, lat: number): Promise<GeocodeResult> => {
  const response = await fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${CONFIG_APP.MAPBOX_ACCESS_TOKEN}&language=ru&types=address`,
  );
  const data: GeoResponse = await response.json();
  const findFeature = extractFeature(data, true);

  if (!findFeature) {
    throw new Error("Not found address");
  }

  return toResult(findFeature, lng, lat);
};