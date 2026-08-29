import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Home">;
};

export const CheckoutScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text>Checkout Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
