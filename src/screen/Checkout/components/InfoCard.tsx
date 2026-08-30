import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export const InfoCard = ({ title, children }: Props) => {
  return (
    <View style={styles.root}>
      <Text style={styles.headerTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    rowGap: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#242424",
  },
});