import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { DropdownFilterWrapper } from "./DropdownFilterWrapper";
import { DualRangeSlider } from "./DualRangeSlider";

type Props = {
  min: number;
  max: number;
  price_from: string;
  price_to: string;
  onChange: (from: string, to: string) => void;
  onReset: () => void;
};

export const DropdownFilterPrice = (props: Props) => {
  const width = Dimensions.get("window").width;
  const [open, setOpen] = useState(false);
  const [valueFrom, setValueFrom] = useState<number>(props.min);
  const [valueTo, setValueTo] = useState<number>(props.max);

  const active =
    (!Number.isNaN(props.price_from) &&
      !Number.isNaN(props.min) &&
      Number(props.price_from) !== Number(props.min)) ||
    (!Number.isNaN(props.price_to) &&
      !Number.isNaN(props.max) &&
      Number(props.price_to) !== Number(props.max));

  const handleOpen = () => {
    if (!Number.isNaN(props.min) && !Number.isNaN(props.max)) {
      setValueFrom(Number(props.price_from));
      setValueTo(Number(props.price_to));
      setOpen(true);
    }
  };

  const handleRangeChange = (from: number, to: number) => {
    setValueFrom(from);
    setValueTo(to);
  };

  const handleSubmit = () => {
    props.onChange(String(valueFrom), String(valueTo));
    setOpen(false);
  };

  const handleReset = () => {
    props.onReset();

    if (open) {
      setOpen(false);
    }
  };

  const label = active
    ? `Цена: от ${Number(props.price_from).toLocaleString("ru-RU")} до ${Number(props.price_to).toLocaleString("ru-RU")}`
    : "Цена, ₽";

  return (
    <>
      <Pressable style={[styles.button, active && styles.buttonActive]} onPress={handleOpen}>
        <Text style={[styles.buttonText, active && styles.buttonTextActive]}>{label}</Text>
        {active && (
          <Pressable hitSlop={8} onPress={handleReset} style={styles.resetIcon}>
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
        <View style={styles.rangeRow}>
          <Text style={styles.rangeValue}>от {valueFrom.toLocaleString("ru-RU")} ₽</Text>
          <Text style={styles.rangeValue}>до {valueTo.toLocaleString("ru-RU")} ₽</Text>
        </View>

        <DualRangeSlider
          min={props.min}
          max={props.max}
          from={valueFrom}
          to={valueTo}
          onChange={handleRangeChange}
          trackWidth={width - 32}
        />
      </DropdownFilterWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#242424",
  },
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
    top: -2.5,
  },
});
