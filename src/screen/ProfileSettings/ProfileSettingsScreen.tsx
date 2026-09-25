import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchService } from "../../shared/fetch-api";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { PageHeader } from "../../shared/ui/header/PageHeader";
import { modalsAdapter } from "../../store/modals/adapter";
import { NotContent } from "../../widgets/not-content/NotContent";
import { FieldInput } from "../../shared/ui/FieldInput/FieldInput";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "ProfileSettings">;
};

export const ProfileSettingsScreen = (props: Props) => {
  const [user, setUser] = useState<{ phone: string; name: string; email: string } | null>(null);
  const [errors, seError] = useState<{ name: string; email: string }>({
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
            phone: response.data.phone,
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

  const handleChangeValues = (value: string, key: "name" | "phone" | "email") => {
    setUser((prev) => prev && { ...prev, [key]: value });
  };

  const handleSubmit = () => {
    console.log("submit");
  };

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
              value={user.name}
            />
            <FieldInput
              error={errors.email}
              label="Почта"
              onChangeText={(value) => handleChangeValues(value, "email")}
              placeholder="Введите почту"
              maxLength={50}
              keyboardType="email-address"
              value={user.email}
            />
            <View style={styles.inputActions}>
              <Pressable style={[styles.inputSubmitButton, styles.inputSubmitButtonCancel]}>
                <Text style={[styles.buttonActionText, styles.inputSubmitButtonCancelText]}>
                  Отмена
                </Text>
              </Pressable>
              <Pressable style={[styles.inputSubmitButton, isLoading && styles.buttonDisabled]}>
                <Text style={styles.buttonActionText}>Подтвердить</Text>
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleClickOpenLogout}>
            <Text style={styles.logoutButtonText}>Выйти из профиля</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <NotContent
            title="Не удалось получить данные о пользователе"
            subTitle="Заказы, избранное, лист ожидания и отзывы — всё в одном аккаунте. Введите номер телефона — на него придёт код подтверждения, и вы войдёте в систему."
            navigateText="Войти"
            onNavigate={handleOpenLoginModal}
          />
        </View>
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
    flex: 1,
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
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  logoutButton: {
    height: 48,
    flexDirection: "row",
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
