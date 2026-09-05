import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Checkbox } from "../../../../../shared/ui/checkbox/Checkbox";
import { DropdownFilterWrapper } from "./DropdownFilterWrapper";

type Props = {
  title: string;
  values: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  onReset: () => void;
};

export const DropdownFilterMultiSelect = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const activeCount = props.selected.length;

  const label = `${props.title}${activeCount ? ` ${activeCount}` : ""}`;

  const handleOpen = () => {
    setSelectValue(props.selected);
    setOpen(true);
  };

  const handleToggle = (v: string) => {
    setSelectValue((prev) => (prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v]));
  };

  const handleReset = () => {
    setSelectValue([]);
    props.onReset();
  };

  const handleSubmit = () => {
    props.onChange(selectValue);
  };

  return (
    <>
      <Pressable
        style={[styles.button, activeCount > 0 && styles.buttonActive]}
        onPress={handleOpen}
      >
        <Text style={[styles.buttonText, activeCount > 0 && styles.buttonTextActive]}>{label}</Text>
        {activeCount > 0 && (
          <Pressable hitSlop={8} onPress={handleReset} style={styles.resetIcon}>
            <Text style={styles.resetIconText}>×</Text>
          </Pressable>
        )}
      </Pressable>

      <DropdownFilterWrapper
        visible={open}
        title={props.title}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {props.values.map((v) => (
            <View key={v} style={styles.item}>
              <Checkbox
                checked={selectValue.includes(v)}
                onPress={() => handleToggle(v)}
                label={v}
              />
            </View>
          ))}
        </ScrollView>
      </DropdownFilterWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e1e6",
    backgroundColor: "white",
  },
  buttonActive: {
    borderColor: "#a73afd",
    backgroundColor: "#f7ecff",
  },
  buttonText: {
    fontSize: 13,
    color: "#242424",
  },
  buttonTextActive: {
    color: "#a73afd",
  },
  resetIcon: {
    marginLeft: 4,
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
  },
  resetIconText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    top: -3,
  },
  list: {
    maxHeight: 500,
  },
  listContent: {
    paddingBottom: 8,
  },
  item: {
    paddingVertical: 10,
  },
});
