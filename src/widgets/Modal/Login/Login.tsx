import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { saveTokens } from "../../../shared/storage/tokens";
import { modalsAdapter } from "../../../store/modals/adapter";
import { modalsStore } from "../../../store/modals/store";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

export const Login = (props: Props) => {
  const visible = modalsStore((store) => store.login);
  const [email, setLogin] = useState("gubin_ruslan3@rambler.ru");
  const [password, setPassword] = useState("123123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCloseModal = () => modalsAdapter.closeLogin();

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Заполните логин и пароль");
    } else {
      const defaultErrorMessage = "Не удалось войти";

      setIsLoading(true);
      setError("");

      fetchService
        .post<{ token: string; refresh: string }>({
          url: "auth/sign-in",
          payload: {
            email: email.trim(),
            password,
          },
        })
        .then(async (response) => {
          if (
            response.status === "success" &&
            response.data &&
            response.data.token &&
            response.data.refresh
          ) {
            await saveTokens(response.data.token, response.data.refresh);
            // setPassword("");
            handleCloseModal();

            if (props.navigationRef.isReady()) {
              props.navigationRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
            }
          } else {
            throw response.message || "Не удалось войти";
          }
        })
        .catch((error) => {
          const message = getMessageError(error, defaultErrorMessage);
          setError(message);
        })
        .finally(() => {
          setIsLoading(false);
        });
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
        <Text style={styles.title}>Вход</Text>

        <TextInput
          style={styles.input}
          placeholder="Логин"
          placeholderTextColor="#c8c8d1"
          value={email}
          onChangeText={setLogin}
          editable={!isLoading}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#c8c8d1"
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            isLoading || pressed ? styles.buttonDisabled : null,
          ]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Войти</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
  },
  input: {
    height: 48,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#c8c8d1",
    borderRadius: 10,
    fontSize: 16,
    color: "#000000",
  },
  errorText: {
    marginBottom: 12,
    fontSize: 14,
    textAlign: "center",
    color: "#e0245e",
  },
  button: {
    height: 48,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#a73afd",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
