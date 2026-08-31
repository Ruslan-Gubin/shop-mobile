import Mapbox, { type ScreenPointPayload } from "@rnmapbox/maps";
import type { Feature, Point, Position } from "geojson";
import { useMemo, useState } from "react";
import { CONFIG_APP } from "../../../../shared/config/config";
import type { AddressItem } from "../../../../store/checkout/types";
import { CustomMarker } from "./CustomMarker";

Mapbox.setAccessToken(CONFIG_APP.MAPBOX_ACCESS_TOKEN);

type Props = {
  initCenter: { lat: number; lng: number };
  active: { lng: number; lat: number } | null;
  markers: AddressItem[];
  initZoom?: number;
  onClickMarker: (lng: number, lat: number) => void;
  onClickMap?: (lng: number, lat: number) => void;
};

export const MapBox = ({
  initCenter,
  active,
  markers,
  initZoom,
  onClickMarker,
  onClickMap,
}: Props) => {
  const [mapZoom, setMapZoom] = useState<"sm" | "md" | "lg">("md");

  const center = useMemo(() => active ?? initCenter, [active, initCenter]);

  const handleClickMap = (feature: Feature<Point, ScreenPointPayload>) => {
    const coordinates = feature.geometry?.coordinates as Position | undefined;
    const lng = coordinates?.[0];
    const lat = coordinates?.[1];

    if (typeof lng === "number" && typeof lat === "number" && onClickMap) {
      onClickMap(lng, lat);
    }
  };

  const handleChangeRegion = (e: { properties?: { zoomLevel?: number } }) => {
    const zoom = e.properties?.zoomLevel;

    if (typeof zoom !== "number") {
      return;
    }

    if (zoom < 14 && mapZoom !== "sm") {
      setMapZoom("sm");
    } else if (zoom > 14 && zoom < 17 && mapZoom !== "md") {
      setMapZoom("md");
    } else if (zoom > 17 && mapZoom !== "lg") {
      setMapZoom("lg");
    }
  };

  const sortedMarkers = useMemo(() => {
    const result: AddressItem[] = [];
    let lastMarkerIndex: number | null = null;

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      if (marker.lng === active?.lng && marker.lat === active?.lat) {
        lastMarkerIndex = i;
      } else {
        result.push(marker);
      }
    }

    if (typeof lastMarkerIndex === "number" && markers[lastMarkerIndex]) {
      result.push(markers[lastMarkerIndex]);
    }

    return result;
  }, [markers, active]);

  return (
    <Mapbox.MapView
      style={{ flex: 1 }}
      styleURL={CONFIG_APP.MAPBOX_STYLE}
      onPress={handleClickMap}
      onRegionDidChange={handleChangeRegion}
    >
      <Mapbox.Camera
        centerCoordinate={[center.lng, center.lat]}
        zoomLevel={initZoom || 15}
        animationDuration={400}
      />
      {sortedMarkers.map((marker) => (
        <Mapbox.PointAnnotation
          key={`${marker.lng}_${marker.lat}_${marker.type}_${marker.name}`}
          id={`${marker.lng}_${marker.lat}_${marker.type}_${marker.name}`}
          coordinate={[marker.lng, marker.lat]}
          anchor={{ x: 0.5, y: 1 }}
          onSelected={() => onClickMarker(marker.lng, marker.lat)}
        >
          <CustomMarker
            active={marker.lng === active?.lng && marker.lat === active?.lat}
            size={mapZoom}
            type={marker.type}
            address={marker.name}
          />
        </Mapbox.PointAnnotation>
      ))}
    </Mapbox.MapView>
  );
};
