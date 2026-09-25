import { useEffect, useRef, useState, useTransition } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useOtpVerification } from "react-native-otp-auto-verify";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { loginCodeSchema, phoneSchema } from "../../../shared/helpers/loginSchema";
import { getDeviceId, saveTokens, setDeviceId } from "../../../shared/storage/tokens";
import { OtpInput } from "../../otp/OtpInput";

type Props = {
  handleCloseModal: () => void;
  rerender: () => void;
};

export const LoginByPhone = (props: Props) => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState(""); //7949 386 57 86
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [validCode, setValidCode] = useState<boolean>(false);
  const [isLoading, transition] = useTransition();
  const [error, setError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const CODE_LENGTH = 6;
  const RESEND_SECONDS = 60;

  const { hashCode, otp, startListening, stopListening } = useOtpVerification({
    numberOfDigits: CODE_LENGTH,
  });
  const isAndroid = Platform.OS === "android";

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (otp && isAndroid) {
      const validationCode = loginCodeSchema.safeParse(otp);
      const validationPhone = phoneSchema.safeParse(phone);

      if (validationCode.success && validationPhone.success) {
        setValidCode(validationCode.success);
        setCode(otp);
        setError("");
        fetchSendCode(validationPhone.data, validationCode.data);
      }
    }
  }, [otp, phone, isAndroid]);

  const handleChangePhone = (value: string) => {
    const validation = phoneSchema.safeParse(value);

    if (validation.success !== validPhone) {
      setValidPhone(validation.success);
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

  const fetchSendPhone = (phone: string) => {
    transition(() => {
      return getDeviceId().then((device_id) => {
        return fetchService
          .post<{ device_id: string; phone: string }>({
            url: "sms/request-otp",
            payload: { phone, device_id, hash_code: isAndroid ? hashCode : "" },
          })
          .then((response) => {
            if (response.status === "success" && response.data) {
              if (response.data?.device_id) {
                setDeviceId(response.data.device_id);
              }

              if (error) {
                setError("");
              }

              startResendTimer();
              if (isAndroid) {
                startListening().catch((err) =>
                  console.warn("Не удалось определить код из SMS", err),
                );
              }
              if (step !== 2) {
                setStep(2);
              }
            } else {
              throw response.message;
            }
          })
          .catch((error) => {
            const errorMessage = getMessageError(error, "Не удалось выслать код на этот номер");
            setError(errorMessage);
          });
      });
    });
  };

  const fetchSendCode = (phone: string, code: string) => {
    transition(() => {
      return fetchService
        .post<{ token: string; refresh: string }>({
          url: "auth/verify-otp",
          payload: { phone, code },
        })
        .then(async (response) => {
          if (response.status === "success" && response.data) {
            setCode("");
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            stopListening();
            saveTokens(response.data.token, response.data.refresh).then(() => {
              props.handleCloseModal();
              props.rerender();
            });
            setError("");
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
    const validationPhone = phoneSchema.safeParse(phone);

    if (step === 1) {
      if (validationPhone.success) {
        fetchSendPhone(validationPhone.data);
      } else {
        const errorMessage =
          Array.isArray(validationPhone.error.issues) &&
          typeof validationPhone.error.issues[0]?.message === "string"
            ? validationPhone.error.issues[0]?.message
            : "Некорректный номер";
        setError(errorMessage);
        setValidPhone(false);
      }
    } else {
      const validationCode = loginCodeSchema.safeParse(code.replace(/\D/g, ""));

      if (validationCode.success && validationPhone.success) {
        fetchSendCode(validationPhone.data, validationCode.data);
      } else if (!validationCode.success) {
        const errorMessage =
          Array.isArray(validationCode.error.issues) &&
          typeof validationCode.error.issues[0]?.message === "string"
            ? validationCode.error.issues[0]?.message
            : "Некорректный номер";
        setError(errorMessage);
        setValidCode(false);
      }
    }
  };

  const handleBackToPhone = () => {
    setStep(1);
    setError("");
    setCode("");
  };

  const handleResendCode = () => {
    const validation = phoneSchema.safeParse(phone);

    if (validation.success) {
      fetchSendPhone(validation.data);
      setValidCode(false);
      setCode("");
      setError("");

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      startResendTimer();
    }
  };

  const disabled =
    isLoading || (step === 1 && (!validPhone || resendSeconds > 0)) || (step === 2 && !validCode);
  const submitText = step === 2 ? "Войти" : "Получить код";

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Вход по номеру телефона</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "На него придёт SMS с кодом подтверждения"
            : `Код отправлен на ${phone ? `${phone}` : ""}`}
        </Text>
      </View>

      {step === 1 && (
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            <TextInput
              style={styles.input}
              placeholder="7 949 123 45 67"
              placeholderTextColor="#b3b3b3"
              value={phone}
              onChangeText={handleChangePhone}
              keyboardType="phone-pad"
              editable={!isLoading}
              autoFocus
              textContentType="telephoneNumber"
              autoComplete="tel"
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

          {resendSeconds <= 0 && (
            <Pressable onPress={handleBackToPhone} disabled={isLoading}>
              <Text style={styles.backLink}>Сменить номер</Text>
            </Pressable>
          )}
          {resendSeconds <= 0 && validPhone && (
            <Pressable onPress={handleResendCode} disabled={isLoading}>
              <Text style={styles.resendLink}>Отправить код ещё раз</Text>
            </Pressable>
          )}
        </>
      )}

      {resendSeconds > 0 && (
        <Text>
          Отправить код повторно через 0:
          {String(resendSeconds).padStart(2, "0")}
        </Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

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
      <Pressable style={[styles.button, styles.buttonCancel]} onPress={props.handleCloseModal}>
        <Text style={[styles.buttonText, styles.buttonTextCancel]}>Отмена</Text>
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
  headerContainer: {
    rowGap: 16,
  },
  title: {
    fontSize: 24,
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
  buttonCancel: {
    backgroundColor: "#f1f1f5",
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
  buttonTextCancel: {
    color: "#a73afd",
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
});
