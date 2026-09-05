import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Checkbox } from "../../../../../shared/ui/checkbox/Checkbox";
import { DropdownFilterWrapper } from "./DropdownFilterWrapper";

type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  title: string;
  label: string;
};

export const DropdownFilterSelect = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string>(props.value);

  const handleSubmit = () => {
    props.onChange(selectValue);
    setOpen(false);
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setOpen(true)}>
        <Text style={styles.buttonText}>{props.label}</Text>
      </Pressable>

      <DropdownFilterWrapper
        visible={open}
        title={props.title}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        {props.options.map((option) => (
          <View key={option.value} style={styles.item}>
            <Checkbox
              checked={selectValue === option.value}
              onPress={() => setSelectValue(option.value)}
              label={option.label}
              isRect
            />
          </View>
        ))}
      </DropdownFilterWrapper>
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
    paddingVertical: 10,
  },
});
