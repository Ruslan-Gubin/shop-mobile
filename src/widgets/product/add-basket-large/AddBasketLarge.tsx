import { Pressable, StyleSheet, Text, View } from "react-native";
import { AddSvg } from "../../../shared/svg/AddSvg";
import { MinusSvg } from "../../../shared/svg/MinusSvg";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";

type Props = {
  id: number;
  available: number | null;
  accounting: boolean;
  variant?: "violet";
};

export const AddBasketLarge = (props: Props) => {
  const count = basketStore((state) => state.items[props.id]) || 0;

  const handleDecrementProduct = (id: number) => basketAdapter.decrement(id);
  const handleIncrement = (id: number) => basketAdapter.increment(id);

  const disabledAddCount = props.accounting && count >= (props.available || 0);
  const disabledDecrement = props.variant !== "violet" && count <= 1;

  const minusSvgFill =
    props.variant === "violet" ? "white" : disabledDecrement ? "#c8c8d1" : "#a73afd";

  const addSvgFill = !disabledAddCount
    ? props.variant === "violet"
      ? "white"
      : "#a73afd"
    : props.variant === "violet"
      ? "gray"
      : "#c8c8d1";

  return (
    <View
      style={[
        styles.addBasketContainer,
        {
          backgroundColor: props.variant === "violet" ? "#a73afd" : "#f1f1f5",
          height: props.variant === "violet" ? 36 : 30,
          borderRadius: props.variant === "violet" ? 12 : 8,
        },
      ]}
    >
      <Pressable
        disabled={disabledDecrement}
        style={styles.button}
        onPress={() => handleDecrementProduct(props.id)}
      >
        <MinusSvg fill={minusSvgFill} size={20} />
      </Pressable>

      <View style={styles.countContainer}>
        <Text
          style={[styles.countValue, { color: props.variant === "violet" ? "white" : "#242424" }]}
        >
          {count}
        </Text>
      </View>

      <Pressable
        disabled={disabledAddCount}
        style={styles.button}
        onPress={() => handleIncrement(props.id)}
      >
        <AddSvg fill={addSvgFill} size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addBasketContainer: {
    paddingInline: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  countContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 30,
  },
  countValue: {
    fontSize: 16,
    fontWeight: 500,
    overflow: "hidden",
  },
});
