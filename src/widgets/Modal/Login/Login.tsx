import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet } from "react-native";
import { modalsAdapter } from "../../../store/modals/adapter";
import { modalsStore } from "../../../store/modals/store";
import { LoginByPhone } from "./LoginByPhone";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};

export const Login = (props: Props) => {
  const visible = modalsStore((store) => store.login);

  //TODO надо перезагрузить текушее состаяние после удачного входа, проверяем на закрытии
  const handleCloseModal = () => {
    // const rootState = props.navigationRef.getRootState();
    // const state = props.navigationRef.getState();
    // console.log(rootState);
    // props.navigationRef.resetRoot(rootState);
    // props.navigationRef.reset(state);
    modalsAdapter.closeLogin();
  };

  return (
    <Modal
      visible={visible}
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LoginByPhone navigationRef={props.navigationRef} handleCloseModal={handleCloseModal} />
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
