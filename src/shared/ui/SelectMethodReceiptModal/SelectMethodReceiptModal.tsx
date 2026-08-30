import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  methodReceipt: "pickup" | "courier";
  onChangeMethod: (value: "pickup" | "courier") => void;
};

export const SelectMethodReceiptModal = ({ methodReceipt, onChangeMethod }: Props) => {
  return (
    <View style={styles.selectTypeContainer}>
      <Pressable
        style={[styles.selectTypeButton, methodReceipt === "pickup" && styles.selectTypeButtonActive]}
        onPress={() => onChangeMethod("pickup")}
      >
        <Text style={[styles.buttonText, methodReceipt === "pickup" && styles.buttonTextActive]}>
          Самовывоз
        </Text>
      </Pressable>
      <Pressable
        style={[styles.selectTypeButton, methodReceipt === "courier" && styles.selectTypeButtonActive]}
        onPress={() => onChangeMethod("courier")}
      >
        <Text style={[styles.buttonText, methodReceipt === "courier" && styles.buttonTextActive]}>
          Курьером
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  selectTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f1f5",
    columnGap: 2,
    height: 44,
    minHeight: 44,
    borderRadius: 12,
    padding: 2,
  },
  selectTypeButton: {
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectTypeButtonActive: {
    backgroundColor: "#fff",
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 14,
    color: "#242424",
  },
  buttonTextActive: {
    color: "#242424",
  },
});