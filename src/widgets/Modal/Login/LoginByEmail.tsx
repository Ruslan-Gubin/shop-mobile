import { useState, useTransition } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { loginEmailSchema, loginPasswordSchema } from "../../../shared/helpers/loginSchema";

type Props = {
  onSuccess: (token: string, refresh: string) => Promise<void>;
  onBack: () => void;
};

export const LoginByEmail = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [isLoading, transition] = useTransition();
  const [error, setError] = useState("");

  const handleChangeEmail = (value: string) => {
    const validation = loginEmailSchema.safeParse(value.trim());

    if (validation.success && !validEmail) {
      setValidEmail(true);
    } else if (!validation.success && validEmail) {
      setValidEmail(false);
    }

    setEmail(value);

    if (error) {
      setError("");
    }
  };

  const handleChangePassword = (value: string) => {
    const validation = loginPasswordSchema.safeParse(value);

    if (validation.success && !validPassword) {
      setValidPassword(true);
    } else if (!validation.success && validPassword) {
      setValidPassword(false);
    }

    setPassword(value);

    if (error) {
      setError("");
    }
  };

  const handleSignIn = () => {
    const validationEmail = loginEmailSchema.safeParse(email.trim());
    const validationPassword = loginPasswordSchema.safeParse(password);

    if (!validationEmail.success) {
      setError("Некорректный email");
      setValidEmail(false);
      return;
    }

    if (!validationPassword.success) {
      setError("Пароль должен содержать минимум 6 символов");
      setValidPassword(false);
      return;
    }

    transition(() => {
      const payload = {
        email: email.trim(),
        password,
      };

      fetchService
        .post<{ token: string; refresh: string }>({ url: "auth/sign-in", payload })
        .then((response) => {
          if (response.status === "success" && response.data) {
            setEmail("");
            setPassword("");
            props.onSuccess(response.data.token, response.data.refresh);
          } else {
            throw response.message;
          }
        })
        .catch((err) => {
          const errorMessage = getMessageError(err, "Не удалось войти");
          setError(errorMessage);
        });
    });
  };

  const disabled = isLoading || !validEmail || !validPassword;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <Text style={styles.subtitle}>Укажите почту и пароль от аккаунта</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="email@example.com"
          placeholderTextColor="#b3b3b3"
          value={email}
          onChangeText={handleChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
          autoFocus
        />

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Пароль"
          placeholderTextColor="#b3b3b3"
          value={password}
          onChangeText={handleChangePassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable style={styles.backButton} onPress={props.onBack} disabled={isLoading}>
        <Text style={styles.backButtonText}>Сменить способ входа</Text>
      </Pressable>

      <Pressable
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          {isLoading && <ActivityIndicator style={styles.buttonIndicator} color="#ffffff" />}
          <Text style={styles.buttonText}>Войти</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    rowGap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#242424",
  },
  subtitle: {
    fontSize: 16,
    color: "#242424",
    textAlign: "center",
  },
  inputWrapper: {
    paddingBlock: 16,
    rowGap: 16,
    width: "100%",
    position: "relative",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#c8c8d1",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  inputError: {
    borderColor: "#e0245e",
  },
  errorText: {
    textAlign: "center",
    color: "#e0245e",
  },
  button: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#a73afd",
    width: "100%",
  },
  buttonContent: {
    position: "relative",
  },
  buttonIndicator: {
    position: "absolute",
    left: -30,
    top: 0,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f3e8ff",
    width: "100%",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a73afd",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
  },
});
