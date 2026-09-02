import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CloseSvg } from "../../../../shared/svg/CloseSvg";

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const BottomSheetFilter = (props: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={props.visible}
      onRequestClose={props.onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={props.onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>{props.title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Закрыть"
              hitSlop={8}
              onPress={props.onClose}
              style={styles.closeButton}
            >
              <CloseSvg size={18} fill="gray" />
            </Pressable>
          </View>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {props.children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  grabber: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e1e1e6",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: "#242424",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingBottom: 8,
  },
});
