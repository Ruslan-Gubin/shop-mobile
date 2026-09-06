import { useRef, useState } from "react";
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
};

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 4;
const MIN_GAP = 100;

export const DualRangeSlider = (props: Props) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const startValues = useRef<{
    from: number;
    to: number;
    startX: number;
    activeThumb?: "from" | "to";
  }>({ from: 0, to: 0, startX: 0 });
  const step = 1;

  const clamp = (value: number) => {
    const stepped = Math.round(value / step) * step;
    return Math.max(props.min, Math.min(props.max, stepped));
  };

  const valueToPosition = (value: number) => {
    if (trackWidth === 0) return 0;
    return ((value - props.min) / (props.max - props.min)) * trackWidth;
  };

  const positionToValue = (position: number) => {
    if (trackWidth === 0) return props.min;
    const raw = (position / trackWidth) * (props.max - props.min) + props.min;
    return clamp(raw);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX } = evt.nativeEvent;
        const fromPos = valueToPosition(props.from);
        const toPos = valueToPosition(props.to);
        const distToFrom = Math.abs(locationX - fromPos);
        const distToTo = Math.abs(locationX - toPos);

        startValues.current = {
          from: props.from,
          to: props.to,
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
          const maxAllowed = props.to - MIN_GAP;
          const clamped = Math.min(newValue, maxAllowed);
          const finalValue = Math.max(clamped, props.min);
          if (finalValue !== props.from) {
            props.onChange(finalValue, props.to);
          }
        } else {
          const minAllowed = props.from + MIN_GAP;
          const clamped = Math.max(newValue, minAllowed);
          const finalValue = Math.min(clamped, props.max);
          if (finalValue !== props.to) {
            props.onChange(props.from, finalValue);
          }
        }
      },
      onPanResponderRelease: () => {
        startValues.current.activeThumb = undefined;
      },
    }),
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  const fromPosition = valueToPosition(props.from);
  const toPosition = valueToPosition(props.to);

  return (
    <View style={styles.container}>
      <View style={styles.labelsRow}>
        <Text style={styles.label}>{props.from.toLocaleString("ru-RU")} ₽</Text>
        <Text style={styles.label}>{props.to.toLocaleString("ru-RU")} ₽</Text>
      </View>

      <View style={styles.sliderContainer} onLayout={handleLayout} {...panResponder.panHandlers}>
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

        <Pressable style={[styles.thumb, { left: fromPosition - THUMB_SIZE / 2 }]}>
          <View style={styles.thumbInner} />
        </Pressable>

        <Pressable style={[styles.thumb, { left: toPosition - THUMB_SIZE / 2 }]}>
          <View style={styles.thumbInner} />
        </Pressable>
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{props.min.toLocaleString("ru-RU")} ₽</Text>
        <Text style={styles.rangeLabel}>{props.max.toLocaleString("ru-RU")} ₽</Text>
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
