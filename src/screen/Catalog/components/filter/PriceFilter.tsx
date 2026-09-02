import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomSheetFilter } from "./BottomSheetFilter";

type Props = {
  minPrice: number;
  maxPrice: number;
  value: { from: string; to: string };
  onChange: (value: { from: string; to: string }) => void;
  onReset: () => void;
  active: boolean;
};

export const PriceFilter = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(props.value.from);
  const [to, setTo] = useState(props.value.to);

  const handleOpen = () => {
    setFrom(props.value.from || String(props.minPrice));
    setTo(props.value.to || String(props.maxPrice));
    setOpen(true);
  };

  const handleChangeInput = (value: string, field: "from" | "to") => {
    if (/^\d*$/.test(value)) {
      if (field === "from") {
        setFrom(value);
      } else {
        setTo(value);
      }
    }
  };

  const handleReset = () => {
    setFrom(String(props.minPrice));
    setTo(String(props.maxPrice));
    props.onReset();
    setOpen(false);
  };

  const handleSubmit = () => {
    props.onChange({ from, to });
    setOpen(false);
  };

  const label = props.active
    ? `Цена: от ${props.value.from} до ${props.value.to}`
    : "Цена, ₽";

  return (
    <>
      <Pressable style={[styles.button, props.active && styles.buttonActive]} onPress={handleOpen}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>

      <BottomSheetFilter visible={open} title="Цена" onClose={() => setOpen(false)}>
        <View style={styles.inputsLine}>
          <View style={styles.inputItem}>
            <Text style={styles.labelInput}>От</Text>
            <TextInput
              value={from}
              onChangeText={(v) => handleChangeInput(v, "from")}
              keyboardType="number-pad"
              style={styles.input}
              placeholder={String(props.minPrice)}
              placeholderTextColor="#c8c8d1"
            />
          </View>
          <View style={styles.inputItem}>
            <Text style={styles.labelInput}>До</Text>
            <TextInput
              value={to}
              onChangeText={(v) => handleChangeInput(v, "to")}
              keyboardType="number-pad"
              style={styles.input}
              placeholder={String(props.maxPrice)}
              placeholderTextColor="#c8c8d1"
            />
          </View>
        </View>

        <View style={styles.actionLine}>
          {props.active && (
            <Pressable style={[styles.actionButton, styles.resetButton]} onPress={handleReset}>
              <Text style={styles.resetText}>Сбросить</Text>
            </Pressable>
          )}
          <Pressable style={[styles.actionButton, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.submitText}>Готово</Text>
          </Pressable>
        </View>
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
  inputsLine: {
    flexDirection: "row",
    columnGap: 8,
  },
  inputItem: {
    flex: 1,
    rowGap: 6,
  },
  labelInput: {
    fontSize: 13,
    color: "#868695",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#e1e1e6",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#242424",
  },
  actionLine: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 8,
    marginTop: 16,
  },
  actionButton: {
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  resetButton: {
    backgroundColor: "#f6f6f9",
  },
  resetText: {
    color: "#242424",
    fontWeight: 600,
  },
  submitButton: {
    backgroundColor: "#a73afd",
  },
  submitText: {
    color: "white",
    fontWeight: 600,
  },
});
