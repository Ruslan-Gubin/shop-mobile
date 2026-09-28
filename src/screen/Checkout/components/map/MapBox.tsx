import Mapbox, { type MapState, type ScreenPointPayload } from "@rnmapbox/maps";
import type { Feature, FeatureCollection, Point, Polygon, Position } from "geojson";
import { useMemo, useState } from "react";
import { CONFIG_APP } from "../../../../shared/config/config";
import type { AddressItem } from "../../../../store/checkout/types";
import { MarkerList } from "./MarkerList";

Mapbox.setAccessToken(CONFIG_APP.MAPBOX_ACCESS_TOKEN);

type Props = {
  initCenter: { lat: number; lng: number };
  active: { lng: number; lat: number } | null;
  markers: AddressItem[];
  initZoom?: number;
  onClickMarker: (lng: number, lat: number) => void;
  onClickMap?: (lng: number, lat: number) => void;
  zones?: FeatureCollection<Polygon, { id: number; color: string; price: number }>;
};

export const MapBox = ({
  initCenter,
  active,
  markers,
  initZoom,
  onClickMarker,
  onClickMap,
  zones,
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

  const handleChangeRegion = (e: MapState) => {
    const zoom = e.properties?.zoom;

    if (typeof zoom === "number") {
      const updateZoom = zoom <= 14 ? "sm" : zoom >= 17 ? "lg" : "md";

      if (updateZoom !== mapZoom) {
        setMapZoom(updateZoom);
      }
    }
  };

  const sortedMarkers = useMemo(() => {
    const result = [];
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
      localizeLabels={{ locale: "ru" }}
      onPress={handleClickMap}
      onMapIdle={handleChangeRegion}
    >
      <Mapbox.Camera
        centerCoordinate={[center.lng, center.lat]}
        zoomLevel={initZoom || 17}
        animationDuration={400}
      />
      {zones && zones.features.length > 0 && (
        <Mapbox.ShapeSource id="delivery-zones" shape={zones}>
          <Mapbox.FillLayer
            id="delivery-zones-fill"
            style={{ fillColor: ["get", "color"], fillOpacity: 0.15 }}
          />
          <Mapbox.LineLayer
            id="delivery-zones-line"
            style={{ lineColor: ["get", "color"], lineWidth: 1.5, lineOpacity: 0.6 }}
          />
        </Mapbox.ShapeSource>
      )}
      <MarkerList
        active={active}
        mapZoom={mapZoom}
        onClickMarker={onClickMarker}
        sortedMarkers={sortedMarkers}
      />
    </Mapbox.MapView>
  );
};
