import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase, "Search">;
  route?: {
    key: string;
    name: string;
    params?: Record<string, string>;
  };
};

export const CatalogScreen = (props: Props) => {
  const [isError, setIsError] = useState<boolean>(false);
  const search = props.route?.params?.search || "";
  console.log(search);

  return (
    <View style={styles.root}>
      <Text>Catalog Screen search: ${search}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingInline: 12,
    rowGap: 16,
    backgroundColor: "white",
    flex: 1,
  },
});
