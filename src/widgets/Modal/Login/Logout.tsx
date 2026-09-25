import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useTransition } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { clearTokens } from "../../../shared/storage/tokens";

type Props = {
  handleCloseModal: () => void;
  rerender: () => void;
  navigateRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

export const Logout = (props: Props) => {
  const [isLoading, transition] = useTransition();

  const logoutAction = () => {
    transition(() => {
      return fetchService
        .post<null>({
          url: "auth/logout",
        })
        .finally(() => {
          clearTokens();
          props.handleCloseModal();
          props.rerender();
          if (props.navigateRef.isReady()) {
            props.navigateRef.navigate("HomeStack");
          }
        });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вы действительно хотите выйти?</Text>

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={logoutAction}
        disabled={isLoading}
      >
        <View style={styles.buttonContent}>
          {isLoading && <ActivityIndicator style={styles.buttonIndicator} color="#ffffff" />}
          <Text style={styles.buttonText}>Выйти</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#242424",
    paddingBottom: 16,
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
});
