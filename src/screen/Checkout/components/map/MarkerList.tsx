import { MarkerView } from "@rnmapbox/maps";
import { Pressable } from "react-native";
import type { AddressItem } from "../../../../store/checkout/types";
import { CustomMarker } from "./CustomMarker";

type Props = {
  active: { lng: number; lat: number } | null;
  onClickMarker: (lng: number, lat: number) => void;
  sortedMarkers: AddressItem[];
  mapZoom: "sm" | "md" | "lg";
};

export const MarkerList = ({ active, onClickMarker, sortedMarkers, mapZoom }: Props) => {
  return (
    <>
      {sortedMarkers.map((marker) => (
        <MarkerView
          key={`${marker.lng}_${marker.lat}_${marker.type}_${marker.name}`}
          id={`${marker.lng}_${marker.lat}_${marker.type}_${marker.name}`}
          coordinate={[marker.lng, marker.lat]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <Pressable onPress={() => onClickMarker(marker.lng, marker.lat)}>
            <CustomMarker
              active={marker.lng === active?.lng && marker.lat === active?.lat}
              size={mapZoom}
              type={marker.type}
              address={marker.name}
            />
          </Pressable>
        </MarkerView>
      ))}
    </>
  );
};
