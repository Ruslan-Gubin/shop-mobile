import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { BottomSheetFilter } from "./BottomSheetFilter";
import { Checkbox } from "../../../../shared/ui/checkbox/Checkbox";

type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export const SortFilter = (props: Props) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    props.onChange(value);
    setOpen(false);
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setOpen(true)}>
        <Text style={styles.buttonText}>
          {props.options.find((el) => el.value === props.value)?.label || "Сортировка"}
        </Text>
      </Pressable>

      <BottomSheetFilter visible={open} title="Сортировка" onClose={() => setOpen(false)}>
        {props.options.map((option) => (
          <Pressable key={option.value} style={styles.item} onPress={() => handleSelect(option.value)}>
            <Checkbox checked={props.value === option.value} onPress={() => handleSelect(option.value)} label={option.label} isRect />
          </Pressable>
        ))}
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
  buttonText: {
    fontSize: 13,
    color: "#242424",
  },
  item: {
    paddingVertical: 8,
  },
});
