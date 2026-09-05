import { useCallback, useRef, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from "react-native";

type Props = {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
  step?: number;
};

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 4;
const MIN_GAP = 100;

export const DualRangeSlider = (props: Props) => {
  const { min, max, from, to, onChange, step = 1 } = props;
  const [trackWidth, setTrackWidth] = useState(0);
  const startValues = useRef<{
    from: number;
    to: number;
    startX: number;
    activeThumb?: "from" | "to";
  }>({ from: 0, to: 0, startX: 0 });

  const clamp = useCallback(
    (value: number) => {
      const stepped = Math.round(value / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step],
  );

  const valueToPosition = useCallback(
    (value: number) => {
      if (trackWidth === 0) return 0;
      return ((value - min) / (max - min)) * trackWidth;
    },
    [min, max, trackWidth],
  );

  const positionToValue = useCallback(
    (position: number) => {
      if (trackWidth === 0) return min;
      const raw = (position / trackWidth) * (max - min) + min;
      return clamp(raw);
    },
    [min, max, trackWidth, clamp],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX } = evt.nativeEvent;
        const fromPos = valueToPosition(from);
        const toPos = valueToPosition(to);
        const distToFrom = Math.abs(locationX - fromPos);
        const distToTo = Math.abs(locationX - toPos);

        startValues.current = {
          from,
          to,
          startX: locationX,
          activeThumb: distToFrom <= distToTo ? "from" : "to",
        };
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState) => {
        const { startX, activeThumb } = startValues.current;

        if (!activeThumb || trackWidth === 0) return;

        const currentX = startX + gestureState.dx;
        const newValue = positionToValue(currentX);

        if (activeThumb === "from") {
          const maxAllowed = to - MIN_GAP;
          const clamped = Math.min(newValue, maxAllowed);
          const finalValue = Math.max(clamped, min);
          if (finalValue !== from) {
            onChange(finalValue, to);
          }
        } else {
          const minAllowed = from + MIN_GAP;
          const clamped = Math.max(newValue, minAllowed);
          const finalValue = Math.min(clamped, max);
          if (finalValue !== to) {
            onChange(from, finalValue);
          }
        }
      },
      onPanResponderRelease: () => {
        startValues.current.activeThumb = undefined;
      },
    }),
  ).current;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const fromPosition = valueToPosition(from);
  const toPosition = valueToPosition(to);

  return (
    <View style={styles.container}>
      <View style={styles.labelsRow}>
        <Text style={styles.label}>{from.toLocaleString("ru-RU")} ₽</Text>
        <Text style={styles.label}>{to.toLocaleString("ru-RU")} ₽</Text>
      </View>

      <View
        style={styles.sliderContainer}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />

        <View
          style={[
            styles.trackActive,
            {
              left: fromPosition,
              width: Math.max(0, toPosition - fromPosition),
            },
          ]}
        />

        <View
          style={[
            styles.thumb,
            { left: fromPosition - THUMB_SIZE / 2 },
          ]}
        >
          <View style={styles.thumbInner} />
        </View>

        <View
          style={[
            styles.thumb,
            { left: toPosition - THUMB_SIZE / 2 },
          ]}
        >
          <View style={styles.thumbInner} />
        </View>
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{min.toLocaleString("ru-RU")} ₽</Text>
        <Text style={styles.rangeLabel}>{max.toLocaleString("ru-RU")} ₽</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#242424",
  },
  sliderContainer: {
    height: THUMB_SIZE + TRACK_HEIGHT + 8,
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: "#e1e1e6",
    top: THUMB_SIZE / 2 + 4,
  },
  trackActive: {
    position: "absolute",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: "#a73afd",
    top: THUMB_SIZE / 2 + 4,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#a73afd",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    top: 4,
  },
  thumbInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#a73afd",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#868695",
  },
});
