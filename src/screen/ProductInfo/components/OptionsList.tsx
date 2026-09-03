import { StyleSheet, Text, View } from "react-native";

export const OptionsList = ({
  title,
  options,
}: {
  title: string;
  options: { label: string; value: string }[];
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsList}>
        {options.map((item) => (
          <View key={item.label} style={styles.optionsItem}>
            <Text style={styles.optionsLabel}>{item.label}</Text>
            <Text style={styles.optionsValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    rowGap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionsList: {
    rowGap: 8,
  },
  optionsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 12,
  },
  optionsLabel: {
    flex: 1,
    color: "#8a8999",
    fontSize: 13,
  },
  optionsValue: {
    flex: 1,
    fontSize: 13,
  },
});
