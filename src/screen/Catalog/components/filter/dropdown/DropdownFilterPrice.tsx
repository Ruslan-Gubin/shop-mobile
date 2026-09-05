import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { DropdownFilterWrapper } from "./DropdownFilterWrapper";
import { DualRangeSlider } from "./DualRangeSlider";

type Props = {
  minPrice: number;
  maxPrice: number;
  value: { from: string; to: string };
  onChange: (value: { from: string; to: string }) => void;
  onReset: () => void;
  active: boolean;
};

export const DropdownFilterPrice = (props: Props) => {
  const { minPrice, maxPrice, value, onChange, onReset, active } = props;
  const [open, setOpen] = useState(false);
  const [fromValue, setFromValue] = useState(minPrice);
  const [toValue, setToValue] = useState(maxPrice);

  const handleOpen = useCallback(() => {
    setFromValue(Number(value.from) || minPrice);
    setToValue(Number(value.to) || maxPrice);
    setOpen(true);
  }, [value.from, value.to, minPrice, maxPrice]);

  const handleRangeChange = useCallback((from: number, to: number) => {
    setFromValue(from);
    setToValue(to);
  }, []);

  const handleSubmit = useCallback(() => {
    onChange({ from: String(fromValue), to: String(toValue) });
    setOpen(false);
  }, [fromValue, toValue, onChange]);

  const handleReset = useCallback(() => {
    setFromValue(minPrice);
    setToValue(maxPrice);
    onReset();
    setOpen(false);
  }, [minPrice, maxPrice, onReset]);

  const label = active
    ? `Цена: от ${Number(value.from).toLocaleString("ru-RU")} до ${Number(value.to).toLocaleString("ru-RU")}`
    : "Цена, ₽";

  return (
    <>
      <Pressable
        style={[styles.button, active && styles.buttonActive]}
        onPress={handleOpen}
      >
        <Text style={[styles.buttonText, active && styles.buttonTextActive]}>
          {label}
        </Text>
        {active && (
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
        title="Цена"
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <DualRangeSlider
          min={minPrice}
          max={maxPrice}
          from={fromValue}
          to={toValue}
          onChange={handleRangeChange}
        />

        {active && (
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Сбросить цену</Text>
          </Pressable>
        )}
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
  resetButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
  },
  resetText: {
    color: "#868695",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
