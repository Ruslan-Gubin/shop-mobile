import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useEffect, useRef, useState, useTransition } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useOtpVerification } from "react-native-otp-auto-verify";
import { fetchService } from "../../../shared/fetch-api";
import { getFormattedPhone } from "../../../shared/helpers/getFormattedPhone";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { loginCodeSchema, loginPhoneSchema } from "../../../shared/helpers/loginSchema";
import { getDeviceId, saveTokens, setDeviceId } from "../../../shared/storage/tokens";
import { OtpInput } from "../../otp/OtpInput";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  handleCloseModal: () => void;
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

  const { hashCode, otp, startListening, stopListening } = useOtpVerification({
    numberOfDigits: CODE_LENGTH,
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopListening;
    };
  }, []);

  // useEffect(() => {
  //   if (step !== 2) {
  //     return;
  //   }
  //
  //   startListening().catch((error) => {
  //     Alert.alert(`Не удалось определить код из SMS ${error}`);
  //   });
  //
  //   return stopListening;
  // }, [step, startListening, stopListening]);

  useEffect(() => {
    if (otp) {
      const validation = loginCodeSchema.safeParse(otp);
      setValidCode(validation.success);
      setCode(otp);
      setError("");
    }
  }, [otp]);

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

  const fetchSendPhone = (phone: string) => {
    transition(async () => {
      const device_id = await getDeviceId();

      return await fetchService
        .post<{ device_id: string; phone: string }>({
          url: "sms/request-otp",
          payload: { phone, device_id },
        })
        .then((response) => {
          console.log(response);
          if (response.status === "success" && response.data) {
            if (response.data?.device_id) {
              setDeviceId(response.data.device_id);
            }

            if (error) {
              setError("");
            }

            startResendTimer();
            startListening().catch((err) => console.warn("Не удалось определить код из SMS", err));
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
  };

  const fetchSendCode = (phone: string, code: string) => {
    transition(async () => {
      return await fetchService
        .post<{ token: string; refresh: string }>({
          url: "auth/verify-otp",
          payload: { phone, code },
        })
        .then(async (response) => {
          console.log(response);

          if (response.status === "success" && response.data) {
            setCode("");
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            stopListening();
            saveTokens(response.data.token, response.data.refresh).then(() => {
              if (props.navigationRef.isReady()) {
                props.handleCloseModal();
                props.navigationRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
              }
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
    if (step === 1) {
      const validation = loginPhoneSchema.safeParse(phone.replace(/\D/g, ""));

      if (validation.success) {
        fetchSendPhone(validation.data);
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
        fetchSendCode(phone, code);
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

  const handleBackToPhone = () => {
    setStep(1);
    setError("");
    setCode("");
  };

  const handleResendCode = () => {
    const validation = loginPhoneSchema.safeParse(phone.replace(/\D/g, ""));

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
            : `Код отправлен на ${phone ? `+7 ${getFormattedPhone(phone)}` : ""}`}
        </Text>
      </View>

      {step === 1 && (
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            <Text style={styles.phoneCode}>+7</Text>
            <TextInput
              style={styles.input}
              placeholder="900 123 45 67"
              placeholderTextColor="#b3b3b3"
              value={phone}
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
});
