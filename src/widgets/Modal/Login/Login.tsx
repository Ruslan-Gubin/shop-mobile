import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getFormattedPhone } from "../../../shared/helpers/getFormattedPhone";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { loginCodeSchema, loginPhoneSchema } from "../../../shared/helpers/loginSchema";
import { saveTokens } from "../../../shared/storage/tokens";
import { modalsAdapter } from "../../../store/modals/adapter";
import { modalsStore } from "../../../store/modals/store";
import { OtpInput } from "../../otp/OtpInput";
import { fetchService } from "../../../shared/fetch-api";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

export const Login = (props: Props) => {
  const visible = modalsStore((store) => store.login);
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
  const MOCK_CODE = "123456";
  const RESEND_SECONDS = 60;
  const MIN_PHONE_DIGITS = 10;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleCloseModal = () => modalsAdapter.closeLogin();

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

  const fetchSendPhone = (phone: string) => {
    console.log(phone);
    // const myPhone = "79493865786";
    // const passwordGorodSms = "8qaGi3cTMqFHd7M";
    // const apiKey = "kQLDEEE02fWKRDz1ehlGlxOl46nbGdu0p0pQVSEKGl5oC45z4M5GXS2gNC2N";

    // const sms = [
    //   {
    //     channel: "digit",
    //     text: "test1",
    //     phone: "79493865786",
    //     plannedAt: 1490612400,
    //   },
    // ];
    // const smsJson = JSON.stringify(sms);
    //
    // fetch(`https://new.smsgorod.ru/apiSms/create?apiKey=${apiKey}&sms=${smsJson}`, {
    //   method: "POST",
    //   body: {
    //     sms: smsJson,
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // const payload = {
    //   apiKey: apiKey,
    //   sms: [
    //     {
    //       // channel: "digit",
    //       channel: "char", // ← вместо "digit"
    //       sender: "VIRTA", // ← имя отправителя
    //       text: "Ваш код: 123456",
    //       // phone: "79493865786",
    //       // text: "test1",
    //       phone: "79493865786",
    //       // plannedAt: 1490612400  // убери, если нужна немедленная отправка
    //     },
    //   ],
    // };

    // fetch("https://new.smsgorod.ru/apiSms/create", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then((res) => res.json())
    //   .then((response) => console.log(response))
    //   .catch((error) => console.error(error));

    transition(() => {
      // fetchService
      //   .post({ url: "auth/sign-in", payload: {} })
      //   .then((response) => {
      //     console.log(response);
      //     if (response.status === "success") {
      //       startResendTimer();
      //       setStep(2);
      //     } else {
      //       console.log(response.message);
      //       throw response.message;
      //     }
      //   })
      //   .catch((error) => {
      //     const errorMessage = getMessageError(error, "Не удалось выслать код на этот номер");
      //     setError(errorMessage);
      //   });
      startResendTimer();
      setStep(2);
    });
  };

  const fetchSendCode = (code: string) => {
    transition(() => {
      const payload = {
        email: "gubin_ruslan3@rambler.ru",
        password: "123123",
      };
      console.log(code);

      fetchService
        .post<{ token: string; refresh: string }>({ url: "auth/sign-in", payload })
        .then(async (response) => {
          console.log(response);

          if (response.status === "success" && response.data) {
            await saveTokens(response.data.token, response.data.refresh);
            setCode("");
            handleCloseModal();

            if (props.navigationRef.isReady()) {
              props.navigationRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
            }
          } else {
            throw response.message;
          }
        })

        .catch((error) => {
          const errorMessage = getMessageError(error, "Не удалось войти");
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
    <Modal
      visible={visible}
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={step === 2 ? handleBackToPhone : handleCloseModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>{step === 1 ? "Вход" : "Введите код"} </Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Укажите номер телефона, на него придёт SMS с кодом"
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

        <Text style={styles.errorText}>
          {step === 2 && resendSeconds <= 0 ? "Время вышло, запросите код еще раз" : error}
        </Text>

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
    rowGap: 12,
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
    paddingBlock: 12,
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
    textAlign: "center",
    color: "#a73afd",
    fontWeight: "600",
  },
});
