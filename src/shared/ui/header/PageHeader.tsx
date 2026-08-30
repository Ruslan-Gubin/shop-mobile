import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowBackIcon } from "../../svg/ArrowBackIcon";

type Props = {
  title: string;
  onBack: () => void;
};

export const PageHeader = ({ title, onBack }: Props) => {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        hitSlop={8}
        onPress={onBack}
        style={styles.buttonBackIcon}
      >
        <ArrowBackIcon fill="black" size={24} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    paddingInline: 12,
    paddingBlock: 6,
    backgroundColor: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonBackIcon: {
    borderRadius: 8,
    backgroundColor: "#f1f1f5",
  },
});
