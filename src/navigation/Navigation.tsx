import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddAddressScreen } from "../screen/AddAddress/AddAddressScreen";
import { AgreementScreen } from "../screen/Agreement/AgreementScreen";
import { OrderDetailScreen } from "../screen/OrderDetail/OrderDetailScreen";
import { TabNavigator } from "./TabNavigator";

const RootStack = createNativeStackNavigator();

export const Navigation = () => (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <RootStack.Screen name="Tabs" component={TabNavigator} />
      <RootStack.Screen name="AddAddress" component={AddAddressScreen} />
      <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <RootStack.Screen name="Agreement" component={AgreementScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);
