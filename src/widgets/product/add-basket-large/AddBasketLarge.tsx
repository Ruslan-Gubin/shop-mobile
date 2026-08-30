import { Pressable, StyleSheet, Text, View } from "react-native";
import { AddSvg } from "../../../shared/svg/AddSvg";
import { MinusSvg } from "../../../shared/svg/MinusSvg";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";

type Props = {
  id: number;
  available: number | null;
  accounting: boolean;
  revalidateBasketAction?: () => Promise<void>;
};

export const AddBasketLarge = (props: Props) => {
  const count = basketStore((state) => state.items[props.id]) || 0;

  const handleDecrementProduct = (id: number) => basketAdapter.decrement(id);
  const handleIncrement = (id: number) => basketAdapter.increment(id);

  const disabledAddCount = props.accounting && count >= (props.available || 0);

  return (
    <View style={styles.addBasketContainer}>
      <Pressable
        disabled={count <= 1}
        style={styles.button}
        onPress={() => handleDecrementProduct(props.id)}
      >
        <MinusSvg fill={count <= 1 ? "#c8c8d1" : "#a73afd"} size={20} />
      </Pressable>

      <View style={styles.countContainer}>
        <Text style={styles.countValue}>{count}</Text>
      </View>

      <Pressable
        disabled={disabledAddCount}
        style={styles.button}
        onPress={() => handleIncrement(props.id)}
      >
        <AddSvg fill={disabledAddCount ? "#c8c8d1" : "#a73afd"} size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addBasketContainer: {
    height: 30,
    paddingInline: 12,
    backgroundColor: "#f1f1f5",
    borderRadius: 8,
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
