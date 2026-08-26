import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "./src/navigation/Navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <StatusBar barStyle="default" />
        <Navigation />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
