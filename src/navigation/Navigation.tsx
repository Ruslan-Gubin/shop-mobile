import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddAddressScreen } from "../screen/AddAddress/AddAddressScreen";
import { AgreementScreen } from "../screen/Agreement/AgreementScreen";
import { Login } from "../widgets/modal/login/Login";
import { TabNavigator } from "./TabNavigator";

const RootStack = createNativeStackNavigator();

export const Navigation = () => {
  const navigationRef = createNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        <RootStack.Screen name="Tabs" component={TabNavigator} />
        <RootStack.Screen name="AddAddress" component={AddAddressScreen} />
        <RootStack.Screen name="Agreement" component={AgreementScreen} />
      </RootStack.Navigator>
      <Login navigationRef={navigationRef} />
    </NavigationContainer>
  );
};
