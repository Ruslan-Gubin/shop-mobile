import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
};

export const SegmentControl = (props: Props) => {
  return (
    <View accessibilityRole="tablist" style={styles.root}>
      {props.options.map((item) => (
        <Pressable
          key={item.value}
          accessibilityRole="tab"
          accessibilityState={{ selected: item.value === props.value }}
          accessibilityLabel={item.label}
          onPress={() => props.onChange(item.value)}
          style={({ pressed }) => [
            styles.item,
            item.value === props.value ? styles.itemActive : styles.itemInactive,
            pressed && styles.itemPressed,
          ]}
        >
          <Text style={item.value === props.value ? styles.labelActive : styles.labelInactive}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    columnGap: 8,
  },
  item: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingInline: 12,
    paddingBlock: 10,
  },
  itemActive: {
    backgroundColor: "#a73afd1A",
  },
  itemInactive: {
    backgroundColor: "#f1f1f5",
  },
  itemPressed: {
    opacity: 0.7,
  },
  labelActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#a73afd",
  },
  labelInactive: {
    fontSize: 13,
    fontWeight: "600",
    color: "#242424",
  },
});
