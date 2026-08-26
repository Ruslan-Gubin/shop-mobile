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
import { saveTokens } from "../../../shared/storage/tokens";

type LoginProps = {
  visible: boolean;
  onClose: () => void;
};

export const Login = ({ visible, onClose }: LoginProps) => {
  const [email, setLogin] = useState("gubin_ruslan3@rambler.ru");
  const [password, setPassword] = useState("123123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      setError("Заполните логин и пароль");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      fetchService
        .post<{ token: string; refresh: string }>({
          url: "auth/sign-in",
          payload: {
            email: email.trim(),
            password,
          },
        })
        .then((response) => {
          if (
            response.status === "success" &&
            response.data &&
            response.data.token &&
            response.data.refresh
          ) {
            saveTokens(response.data.token, response.data.refresh);
          } else {
            setError(response.message || "Не удалось войти");
            return;
          }
        });

      setPassword("");
      onClose();
    } catch (err) {
      console.log("sign-in request failed:", err);
      setError("Ошибка сети. Попробуйте ещё раз");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          style={styles.avoiding}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
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
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  avoiding: {
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
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
