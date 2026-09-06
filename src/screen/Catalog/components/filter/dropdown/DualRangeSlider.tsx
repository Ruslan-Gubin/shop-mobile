import { useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

type Props = {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
  thumbSize?: number;
  trackHeight?: number;
  trackWidth: number;
};

export const DualRangeSlider = (props: Props) => {
  const trackHeight = props.trackHeight || 4;
  const thumbSize = props.thumbSize || 24;

  const valueRange = props.max - props.min;

  const valueToPx = (val: number) =>
    ((val - props.min) / valueRange) * (props.trackWidth - thumbSize);
  const pxToValue = (px: number) =>
    Math.round(props.min + (px / (props.trackWidth - thumbSize)) * valueRange);

  const leftStart = valueToPx(props.from);
  const rightStart = valueToPx(props.to);

  const leftX = useRef(new Animated.Value(leftStart)).current;
  const rightX = useRef(new Animated.Value(rightStart)).current;

  const leftPosRef = useRef(leftStart);
  const rightPosRef = useRef(rightStart);

  const notify = (from: number, to: number) => props.onChange(from, to);

  const leftPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 2,
      onPanResponderMove: (_, gs) => {
        const currentValue = gs.moveX - thumbSize;

        if (currentValue > 0 && currentValue < rightPosRef.current - thumbSize) {
          leftX.setValue(currentValue);
          leftPosRef.current = currentValue;
        }
      },
      onPanResponderRelease: () => {
        const updateFrom = pxToValue(leftPosRef.current);
        const updateTo = pxToValue(rightPosRef.current);

        notify(updateFrom, updateTo);
      },
    }),
  ).current;

  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 2,
      onPanResponderMove: (_, gs) => {
        const currentValue = gs.moveX - thumbSize;

        if (
          currentValue > leftPosRef.current + thumbSize &&
          currentValue <= props.trackWidth - thumbSize
        ) {
          rightX.setValue(currentValue);
          rightPosRef.current = currentValue;
        }
      },
      onPanResponderRelease: () => {
        const updateFrom = pxToValue(leftPosRef.current);
        const updateTo = pxToValue(rightPosRef.current);
        notify(updateFrom, updateTo);
      },
    }),
  ).current;

  const fillWidth = Animated.subtract(rightX, leftX);

  return (
    <View style={[styles.container, { width: props.trackWidth }]}>
      <View
        style={[
          styles.track,
          {
            width: props.trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.fill,
          {
            height: trackHeight,
            borderRadius: trackHeight / 2,
            left: thumbSize / 2,
            transform: [{ translateX: leftX }],
            width: fillWidth,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            left: 0,
            transform: [{ translateX: leftX }],
          },
        ]}
        {...leftPanResponder.panHandlers}
      >
        <View style={styles.thumbLabel}></View>
      </Animated.View>

      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            left: 0,
            transform: [{ translateX: rightX }],
          },
        ]}
        {...rightPanResponder.panHandlers}
      >
        <View style={styles.thumbLabel}></View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    position: "absolute",
    backgroundColor: "#e1e1e6",
  },
  fill: {
    position: "absolute",
    backgroundColor: "#a73afd",
  },
  thumb: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#a73afd",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLabel: {
    backgroundColor: "#a73afd",
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
});

