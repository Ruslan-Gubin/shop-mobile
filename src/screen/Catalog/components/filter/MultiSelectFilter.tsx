import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { BottomSheetFilter } from "./BottomSheetFilter";
import { Checkbox } from "../../../../shared/ui/checkbox/Checkbox";

type Props = {
  title: string;
  values: string[];
  selected: string[];
  onChange: (value: string) => void;
  onReset: () => void;
};

export const MultiSelectFilter = (props: Props) => {
  const [open, setOpen] = useState(false);
  const activeCount = props.selected.length;

  const label = `${props.title}${activeCount ? ` ${activeCount}` : ""}`;

  return (
    <>
      <Pressable style={[styles.button, activeCount > 0 && styles.buttonActive]} onPress={() => setOpen(true)}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>

      <BottomSheetFilter visible={open} title={props.title} onClose={() => setOpen(false)}>
        {props.values.map((value) => {
          const isChecked = props.selected.includes(value);
          return (
            <Pressable key={value} style={styles.item} onPress={() => props.onChange(value)}>
              <Checkbox
                checked={isChecked}
                onPress={() => props.onChange(value)}
                label={value}
              />
            </Pressable>
          );
        })}
        {activeCount > 0 && (
          <Pressable style={styles.resetButton} onPress={props.onReset}>
            <Text style={styles.resetText}>Сбросить</Text>
          </Pressable>
        )}
      </BottomSheetFilter>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e1e6",
    backgroundColor: "white",
  },
  buttonActive: {
    borderColor: "#a73afd",
  },
  buttonText: {
    fontSize: 13,
    color: "#242424",
  },
  item: {
    paddingVertical: 8,
  },
  resetButton: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  resetText: {
    color: "#a73afd",
    fontWeight: 600,
  },
});
