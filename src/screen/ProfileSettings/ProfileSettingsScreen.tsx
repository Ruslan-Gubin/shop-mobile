import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { FieldInput } from "../../shared/ui/FieldInput/FieldInput";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { modalsAdapter } from "../../store/modals/adapter";
import { NotContent } from "../../widgets/not-content/NotContent";
import { changeProfileSchema } from "./schema";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "ProfileSettings">;
};

export const ProfileSettingsScreen = (props: Props) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [values, setValues] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [errors, setError] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchUser = useEffectEvent(() => {
    setLoading(true);
    fetchService
      .get<{
        email: string | null;
        id: number;
        name: string;
        phone: string;
        role: string;
      }>({
        url: "users/me",
      })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setUser({
            name: response.data?.name || "",
            email: response.data?.email || "",
          });
          setValues({
            name: response.data?.name || "",
            email: response.data?.email || "",
          });
        } else {
          throw response.message;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось получить данные о пользователе");

        Alert.alert("Ошибка", message, [
          {
            text: "Отмена",
            style: "default",
          },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: fetchUser,
          },
        ]);
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const handleClickOpenLogout = () => modalsAdapter.openLogout();
  const handleOpenLoginModal = () => modalsAdapter.openLogin();

  const handleChangeValues = (value: string, key: "name" | "email") => {
    setValues((prev) => prev && { ...prev, [key]: value });
    setError((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = () => {
    const validation = changeProfileSchema.safeParse({
      name: values.name,
      email: values.email,
    });

    if (!validation.success) {
      const updateError = {
        name: "",
        email: "",
      };

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        if (field === "name") {
          updateError.name = issue.message;
        }

        if (field === "email") {
          updateError.email = issue.message;
        }
      });
    } else {
      setLoading(true);

      fetchService
        .patch<null>({
          url: "users/update-profile",
          payload: validation.data,
        })
        .then((response) => {
          if (response.status === "success") {
            fetchUser();
          } else {
            if (response.errors.length > 0) {
              const updateErrors = {
                name: "",
                email: "",
              };
              const emailError = response.errors.find((el) => el.key === "email");
              if (emailError) {
                updateErrors.email = emailError.message;
              }

              const nameError = response.errors.find((el) => el.key === "name");

              if (nameError) {
                updateErrors.name = nameError.message;
              }

              setError(updateErrors);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleReset = () =>
    setValues({ name: user ? user.name : "", email: user ? user.email : "" });

  const hasChange = user && (user.name !== values.name || user.email !== values.email);
  const disabledSubmit = isLoading || !hasChange;

  return (
    <View style={styles.root}>
      <PageHeader title="Настройки" onBack={() => props?.navigation?.goBack()} />
      {user ? (
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <FieldInput
              error={errors.name}
              label="Имя"
              onChangeText={(value) => handleChangeValues(value, "name")}
              placeholder="Введите имя"
              maxLength={50}
              value={values.name}
            />
            <FieldInput
              error={errors.email}
              label="Почта"
              onChangeText={(value) => handleChangeValues(value, "email")}
              placeholder="Введите почту"
              maxLength={50}
              keyboardType="email-address"
              value={values.email}
            />
            <View style={styles.inputActions}>
              {hasChange && (
                <Pressable
                  onPress={handleReset}
                  style={[styles.inputSubmitButton, styles.inputSubmitButtonCancel]}
                >
                  <Text style={[styles.buttonActionText, styles.inputSubmitButtonCancelText]}>
                    Отмена
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleSubmit}
                disabled={disabledSubmit}
                style={[styles.inputSubmitButton, disabledSubmit && styles.buttonDisabled]}
              >
                <Text style={styles.buttonActionText}>Подтвердить</Text>
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleClickOpenLogout}>
            <Text style={styles.logoutButtonText}>Выйти из профиля</Text>
          </Pressable>
        </View>
      ) : (
        <NotContent
          title="Не удалось получить данные о пользователе"
          subTitle="Заказы, избранное, лист ожидания и отзывы — всё в одном аккаунте. Введите номер телефона — на него придёт код подтверждения, и вы войдёте в систему."
          navigateText="Войти"
          onNavigate={handleOpenLoginModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
    rowGap: 16,
  },
  content: {
    paddingInline: 12,
    rowGap: 16,
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  inputContainer: {
    rowGap: 12,
  },
  inputActions: {
    flexDirection: "row",
    columnGap: 12,
    justifyContent: "flex-end",
  },
  inputSubmitButton: {
    flex: 0.5,
    maxWidth: "50%",
    borderRadius: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a73afd",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  inputSubmitButtonCancel: {
    backgroundColor: "#f1f1f5",
  },
  buttonActionText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#ffffff",
  },
  inputSubmitButtonCancelText: {
    color: "#a73afd",
  },
  logoutButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#f1f1f5",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#a73afd",
  },
});
