import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Home">;
};

export const CartScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text>CartScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
