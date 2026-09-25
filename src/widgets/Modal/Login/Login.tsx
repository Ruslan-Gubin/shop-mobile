import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet } from "react-native";
import { modalsAdapter } from "../../../store/modals/adapter";
import { modalsStore } from "../../../store/modals/store";
import { LoginByPhone } from "./LoginByPhone";
import { Logout } from "./Logout";

type Props = {
  rerender: () => void;
  navigateRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

export const Login = (props: Props) => {
  const login = modalsStore((store) => store.login);
  const logout = modalsStore((store) => store.logout);

  const handleCloseModal = () => {
    modalsAdapter.closeLogin();
    modalsAdapter.closeLogout();
  };

  return (
    <Modal
      visible={login || logout}
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {login && <LoginByPhone rerender={props.rerender} handleCloseModal={handleCloseModal} />}
        {logout && (
          <Logout
            navigateRef={props.navigateRef}
            rerender={props.rerender}
            handleCloseModal={handleCloseModal}
          />
        )}
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
  },
});
