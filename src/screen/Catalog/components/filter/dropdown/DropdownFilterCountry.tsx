import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Checkbox } from "../../../../../shared/ui/checkbox/Checkbox";
import { DropdownFilterWrapper } from "./DropdownFilterWrapper";

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
  onReset: () => void;
};

export const DropdownFilterCountry = (props: Props) => {
  const { title, options, selected, onChange, onReset } = props;
  const [open, setOpen] = useState(false);
  const [pendingSelected, setPendingSelected] = useState<string[]>([]);
  const activeCount = selected.length;

  const label = `${title}${activeCount ? ` ${activeCount}` : ""}`;

  const handleOpen = useCallback(() => {
    setPendingSelected([...selected]);
    setOpen(true);
  }, [selected]);

  const handleToggle = useCallback((v: string) => {
    setPendingSelected((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v],
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const toAdd = pendingSelected.filter((v) => !selected.includes(v));
    const toRemove = selected.filter((v) => !pendingSelected.includes(v));

    toRemove.forEach((v) => onChange(v));
    toAdd.forEach((v) => onChange(v));

    setOpen(false);
  }, [pendingSelected, selected, onChange]);

  return (
    <>
      <Pressable
        style={[styles.button, activeCount > 0 && styles.buttonActive]}
        onPress={handleOpen}
      >
        <Text style={[styles.buttonText, activeCount > 0 && styles.buttonTextActive]}>
          {label}
        </Text>
        {activeCount > 0 && (
          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              onReset();
            }}
            style={styles.resetIcon}
          >
            <Text style={styles.resetIconText}>×</Text>
          </Pressable>
        )}
      </Pressable>

      <DropdownFilterWrapper
        visible={open}
        title={title}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {options.map((v) => {
            const isChecked = pendingSelected.includes(v);
            return (
              <Pressable key={v} style={styles.item} onPress={() => handleToggle(v)}>
                <Checkbox
                  checked={isChecked}
                  onPress={() => handleToggle(v)}
                  label={v}
                />
              </Pressable>
            );
          })}
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
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
  },
  resetIconText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
  list: {
    maxHeight: 400,
  },
  listContent: {
    paddingBottom: 8,
  },
  item: {
    paddingVertical: 10,
  },
});
