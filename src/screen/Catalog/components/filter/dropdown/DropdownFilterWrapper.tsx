import { useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  children: React.ReactNode;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const DropdownFilterWrapper = (props: Props) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const closeSheet = (isSubmitAction?: boolean) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isSubmitAction && typeof props.onSubmit === "function") {
        props.onSubmit();
      }

      props.onClose();
      translateY.setValue(SCREEN_HEIGHT);
      overlayOpacity.setValue(0);
    });
  };

  const openSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150 || gs.vy > 0.5) {
          closeSheet();
        } else {
          Animated.timing(translateY, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onShow={openSheet}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={styles.overlayPressable} onPress={() => closeSheet()} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers}>
            <Pressable onPress={(event) => event.stopPropagation()}>
              <View>
                <View style={styles.grabberArea}>
                  <View style={styles.grabber} />
                </View>

                <View style={styles.header}>
                  <Text style={styles.title}>{props.title}</Text>
                </View>
              </View>
            </Pressable>
          </View>

          <View style={styles.content}>{props.children}</View>

          {props.onSubmit && (
            <View style={styles.footer}>
              <Pressable style={styles.submitButton} onPress={() => closeSheet(true)}>
                <Text style={styles.submitText}>{props.submitLabel || "Применить"}</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayPressable: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "85%",
    paddingBottom: 34,
  },
  grabberArea: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e1e1e6",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f5",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#242424",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: "#a73afd",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
