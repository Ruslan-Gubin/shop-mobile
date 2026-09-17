import { useEffect, useRef, useState, useTransition } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getFormattedPhone } from "../../../shared/helpers/getFormattedPhone";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { loginCodeSchema, loginPhoneSchema } from "../../../shared/helpers/loginSchema";
import { OtpInput } from "../../otp/OtpInput";

type Props = {
  onSuccess: (token: string, refresh: string) => Promise<void>;
  onBack: () => void;
};

export const LoginByPhone = (props: Props) => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [validCode, setValidCode] = useState<boolean>(false);
  const [isLoading, transition] = useTransition();
  const [error, setError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const CODE_LENGTH = 6;
  const RESEND_SECONDS = 60;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleBackToPhone = () => {
    setStep(1);
    setError("");
  };

  const handleChangePhone = (value: string) => {
    const validation = loginPhoneSchema.safeParse(value.replace(/\D/g, ""));

    if (validation.success && !validPhone) {
      setValidPhone(true);
    } else if (!validation.success && validPhone) {
      setValidPhone(false);
    }

    setPhone(value);

    if (error) {
      setError("");
    }
  };

  const handleChangeCode = (value: string) => {
    const validation = loginCodeSchema.safeParse(value.replace(/\D/g, ""));

    if (validation.success && !validCode) {
      setValidCode(true);
    } else if (!validation.success && validCode) {
      setValidCode(false);
    }

    setCode(value.replace(/\D/g, ""));
    setError("");
  };

  const startResendTimer = () => {
    setResendSeconds(RESEND_SECONDS);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setResendSeconds((seconds) => {
        if (seconds <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  };

  const fetchSendPhone = (phoneValue: string) => {
    console.log(phoneValue);
    transition(() => {
      // TODO: отправка SMS-кода на бэкенде
    });
  };

  const fetchSendCode = (codeValue: string) => {
    transition(() => {
      const payload = {
        email: "gubin_ruslan3@rambler.ru",
        password: "123123",
      };
      console.log(codeValue);

      fetchService
        .post<{ token: string; refresh: string }>({ url: "auth/sign-in", payload })
        .then(async (response) => {
          console.log(response);

          if (response.status === "success" && response.data) {
            setCode("");
            await props.onSuccess(response.data.token, response.data.refresh);
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

  const handleSignIn = async () => {
    if (step === 1) {
      const validation = loginPhoneSchema.safeParse(phone.replace(/\D/g, ""));

      if (validation.success) {
        fetchSendPhone(phone);
      } else {
        const errorMessage =
          Array.isArray(validation.error.issues) &&
          typeof validation.error.issues[0]?.message === "string"
            ? validation.error.issues[0]?.message
            : "Некорректный номер";
        setError(errorMessage);
        setValidPhone(false);
      }
    } else {
      const validation = loginCodeSchema.safeParse(code.replace(/\D/g, ""));

      if (validation.success) {
        fetchSendCode(code);
      } else {
        const errorMessage =
          Array.isArray(validation.error.issues) &&
          typeof validation.error.issues[0]?.message === "string"
            ? validation.error.issues[0]?.message
            : "Некорректный номер";
        setError(errorMessage);
        setValidCode(false);
      }
    }
  };

  const handleResendCode = () => {
    fetchSendPhone(phone);
    setValidCode(false);
    setCode("");
    setError("");
    startResendTimer();
  };

  const disabled =
    isLoading || (step === 1 && !validPhone) || (step === 2 && (!validCode || resendSeconds <= 0));
  const submitText = step === 2 ? (resendSeconds <= 0 ? "Время вышло" : "Войти") : "Получить код";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step === 1 ? "Введите номер телефона" : "Введите код"}</Text>
      <Text style={styles.subtitle}>
        {step === 1
          ? "На него придёт SMS с кодом подтверждения"
          : `Код отправлен на ${phone ? `+7 ${getFormattedPhone(phone)}` : ""}`}
      </Text>

      {step === 1 && (
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            <Text style={styles.phoneCode}>+7</Text>
            <TextInput
              style={styles.input}
              placeholder="900 123 45 67"
              placeholderTextColor="#b3b3b3"
              value={getFormattedPhone(phone)}
              onChangeText={handleChangePhone}
              keyboardType="phone-pad"
              editable={!isLoading}
              autoFocus
            />
          </View>
        </View>
      )}

      {step === 2 && (
        <>
          <View style={styles.inputWrapper}>
            <OtpInput
              value={code}
              onChangeText={handleChangeCode}
              length={CODE_LENGTH}
              editable={!isLoading}
              error={Boolean(error)}
            />
          </View>

          {resendSeconds > 0 && (
            <Text>Отправить код повторно через 0:{String(resendSeconds).padStart(2, "0")}</Text>
          )}

          {resendSeconds <= 0 && validPhone && (
            <Pressable onPress={handleResendCode} disabled={isLoading}>
              <Text style={styles.resendLink}>Отправить код ещё раз</Text>
            </Pressable>
          )}

          <Pressable onPress={handleBackToPhone} disabled={isLoading}>
            <Text style={styles.backLink}>Сменить номер</Text>
          </Pressable>
        </>
      )}

      <Pressable style={styles.backButton} onPress={props.onBack} disabled={isLoading}>
        <Text style={styles.backButtonText}>Сменить способ входа</Text>
      </Pressable>

      {(error || (step === 2 && resendSeconds <= 0)) && (
        <Text style={styles.errorText}>
          {step === 2 && resendSeconds <= 0 ? "Время вышло, запросите код еще раз" : error}
        </Text>
      )}

      <Pressable
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          {isLoading && <ActivityIndicator style={styles.buttonIndicator} color="#ffffff" />}
          <Text style={styles.buttonText}>{submitText}</Text>
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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#c8c8d1",
    borderRadius: 12,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  inputContainerError: {
    borderColor: "#e0245e",
  },
  phoneCode: {
    paddingLeft: 14,
    fontSize: 16,
    color: "#171717",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000000",
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
  buttonText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
  },
  resendLink: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    color: "#a73afd",
  },
  backLink: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    color: "#a73afd",
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
});
