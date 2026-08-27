import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  message?: string | Error;
  callback?: {
    action: () => undefined;
    text: string;
  };
};

export const ErrorAlert = (props: Props) => {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.icon}>
            <Text>⚠️</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              {typeof props.message === "string" && props.message.length > 0
                ? props.message
                : props.message instanceof Error &&
                    props.message.message &&
                    props.message.message.length > 0
                  ? props.message.message
                  : "Ошибка"}
            </Text>
          </View>
        </View>

        {props.callback && (
          <View style={styles.footer}>
            <Pressable onPress={props.callback.action}>
              <Text style={styles.actionButton}>{props.callback.text}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingInline: 12,
  },
  container: {
    rowGap: 8,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    columnGap: 12,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    color: "#6b7280",
  },
  footer: {
    width: "100%",
    alignItems: "center",
  },
  actionButton: {
    color: "#9a1cc6",
  },
});
