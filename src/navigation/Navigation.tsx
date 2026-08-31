import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddAddressScreen } from "../screen/AddAddress/AddAddressScreen";
import { TabNavigator } from "./TabNavigator";

const RootStack = createNativeStackNavigator();

export const Navigation = () => (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={TabNavigator} />
      <RootStack.Screen name="AddAddress" component={AddAddressScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);
