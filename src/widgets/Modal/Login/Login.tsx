import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { saveTokens } from "../../../shared/storage/tokens";
import { modalsAdapter } from "../../../store/modals/adapter";
import { modalsStore } from "../../../store/modals/store";
import { LoginByEmail } from "./LoginByEmail";
import { LoginByPhone } from "./LoginByPhone";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

export type LoginMethod = "sms" | "email" | "";

export const Login = (props: Props) => {
  const visible = modalsStore((store) => store.login);
  const [method, setMethod] = useState<LoginMethod>("");

  const handleCloseModal = () => modalsAdapter.closeLogin();
  const handleBackToMethods = () => setMethod("");

  const handleSuccess = async (token: string, refresh: string) => {
    await saveTokens(token, refresh);
    handleCloseModal();

    if (props.navigationRef.isReady()) {
      props.navigationRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
    }
  };

  return (
    <Modal
      visible={visible}
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {method === "" && (
          <>
            <Text style={styles.title}>Выберите способ входа</Text>
            <View style={styles.methods}>
              <Pressable style={styles.methodButton} onPress={() => setMethod("sms")}>
                <Text style={styles.methodText}>По SMS</Text>
              </Pressable>
              <Pressable style={styles.methodButton} onPress={() => setMethod("email")}>
                <Text style={styles.methodText}>Почта и пароль</Text>
              </Pressable>
            </View>
          </>
        )}

        {method === "sms" && <LoginByPhone onSuccess={handleSuccess} onBack={handleBackToMethods} />}
        {method === "email" && <LoginByEmail onSuccess={handleSuccess} onBack={handleBackToMethods} />}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingInline: 24,
    backgroundColor: "#ffffff",
    rowGap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#242424",
    paddingBottom: 32,
  },
  methods: {
    rowGap: 16,
    width: "100%",
  },
  methodButton: {
    backgroundColor: "#a73afd",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  methodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
