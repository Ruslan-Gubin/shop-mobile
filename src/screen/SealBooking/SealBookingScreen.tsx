import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Home">;
};

export const SealBookingScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text>Seal</Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Text>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
