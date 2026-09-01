import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PageHeader } from "../../shared/ui/header/PageHeader";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Agreement">;
  route: {
    params?: {
      title?: string;
      content?: string;
    };
  };
};

export const AgreementScreen = ({ navigation, route }: Props) => {
  const title = route?.params?.title ?? "";
  const content =
    route?.params?.content ?? "Содержание страницы появится позже.";

  return (
    <View style={styles.root}>
      <PageHeader title={title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>{content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#242424",
  },
});