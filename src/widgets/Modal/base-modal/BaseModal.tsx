import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  title?: string;
  subtitleText?: string;
  errorText?: string;
  onClose: () => void;
  children?: React.ReactNode;
  footerAction?: {
    cancel?: { text: string; action: () => void; backgroundColor: string; disabled?: boolean };
    submit?: { text: string; action: () => void; backgroundColor: string; disabled?: boolean };
  };
};

export const BaseModal = (props: Props) => {
  return (
    <Modal animationType="fade" transparent visible={props.visible} onRequestClose={props.onClose}>
      <Pressable style={styles.centeredView} onPress={props.onClose}>
        <KeyboardAvoidingView
          style={styles.avoiding}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={styles.modalView} onPress={(event) => event.stopPropagation()}>
            {props.title && (
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{props.title}</Text>
              </View>
            )}

            <View style={styles.content}>
              {props.subtitleText && <Text style={styles.subtitleText}>{props.subtitleText}</Text>}
              {props.errorText && <Text style={styles.errorText}>{props.errorText}</Text>}
              {props.children && props.children}
            </View>
            {props.footerAction && (
              <View style={styles.footer}>
                {props.footerAction.cancel && (
                  <Pressable
                    disabled={props.footerAction.cancel.disabled}
                    style={[
                      styles.buttonCancel,
                      props.footerAction.cancel.disabled && styles.buttonDisabled,
                      { backgroundColor: props.footerAction.cancel.backgroundColor },
                    ]}
                    onPress={props.footerAction.cancel.action}
                  >
                    <Text style={styles.buttonCancelText}>{props.footerAction.cancel.text}</Text>
                  </Pressable>
                )}
                {props.footerAction.submit && (
                  <Pressable
                    disabled={props.footerAction.submit.disabled}
                    style={[
                      styles.buttonDelete,
                      props.footerAction.submit.disabled && styles.buttonDisabled,
                      { backgroundColor: props.footerAction.submit.backgroundColor },
                    ]}
                    onPress={props.footerAction.submit.action}
                  >
                    <Text style={styles.buttonDeleteText}>{props.footerAction.submit.text}</Text>
                  </Pressable>
                )}
              </View>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "linear-gradient(to right, #00000070, #00000070)",
    paddingInline: 12,
  },
  avoiding: {
    justifyContent: "center",
    backgroundColor: "red",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    minWidth: "100%",
    padding: 12,
    rowGap: 12,
  },
  header: {
    minWidth: "100%",
  },
  headerTitle: {
    fontWeight: 500,
    fontSize: 18,
    color: "#242424",
  },
  content: {
    rowGap: 6,
  },
  subtitleText: {
    fontWeight: 500,
    color: "#242424",
  },
  errorText: {
    fontWeight: 500,
    color: "#f32d2d",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 12,
    paddingBlock: 12,
  },
  buttonCancel: {
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 12,
  },
  buttonCancelText: {
    color: "gray",
    fontWeight: 700,
  },
  buttonDelete: {
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 12,
  },
  buttonDeleteText: {
    color: "white",
    fontWeight: 700,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
