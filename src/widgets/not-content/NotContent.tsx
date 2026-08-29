import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subTitle: string;
  navigateText?: string;
  onNavigate?: () => void;
};

export const NotContent = (props: Props) => {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subTitle}>{props.subTitle}</Text>
      {typeof props.onNavigate === "function" && props.navigateText && (
        <Pressable onPress={props.onNavigate} style={styles.button}>
          <Text style={styles.navigateText}>{props.navigateText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    rowGap: 12,
    marginTop: 4,
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
  },
  subTitle: {
    color: "#868695",
  },
  button: {
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 36,
  },

  navigateText: {
    color: "white",
    fontWeight: 800,
  },
});
