import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { AgreementScreen } from "../screen/Agreement/AgreementScreen";
import { Login } from "../widgets/modal/login/Login";
import { TabNavigator } from "./TabNavigator";

const RootStack = createNativeStackNavigator();

export const Navigation = () => {
  const [key, setKey] = useState("1");

  const handleChangeKey = () => setKey((prev) => String(Number(prev) + 1));

  return (
    <NavigationContainer>
      <RootStack.Navigator key={key} screenOptions={{ headerShown: false, animation: "fade" }}>
        <RootStack.Screen name="Tabs" component={TabNavigator} />
        <RootStack.Screen name="Agreement" component={AgreementScreen} />
      </RootStack.Navigator>
      <Login rerender={handleChangeKey} />
    </NavigationContainer>
  );
};
