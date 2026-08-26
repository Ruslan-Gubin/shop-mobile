import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartSvg } from "../../../shared/svg/CartSvg";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";

type Props = {
  id: number;
  available: number | null;
  revalidateBasketAction?: () => Promise<void>;
};

export const AddBasket = (props: Props) => {
  const count = basketStore((state) => state.items[props.id]) || 0;

  const isHasBasket = count > 0;

  const handleTouch = (id: number) => {
    if (isHasBasket) {
      basketAdapter.decrement(id);
    } else {
      basketAdapter.add(id);
    }
    if (props.revalidateBasketAction) {
      props.revalidateBasketAction();
    }
  };

  return (
    <View style={styles.addBasketContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isHasBasket ? "#ead4f7" : "#b734e4" }]}
        onPress={() => handleTouch(props.id)}
      >
        <CartSvg size={16} fill={isHasBasket ? "#a73afd" : "white"} />
      </TouchableOpacity>
      {isHasBasket && (
        <View style={styles.countContainer}>
          <View style={styles.count}>
            <Text style={styles.countValue}>{count}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addBasketContainer: {
    position: "absolute",
    bottom: -15,
    right: 8,
    width: 30,
    height: 30,
    backgroundColor: "white",
    padding: 1,
    borderRadius: 10,
    zIndex: 1,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  countContainer: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "white",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    overflow: "hidden",
  },
  count: {
    minWidth: 14,
    overflow: "hidden",
    borderRadius: "50%",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  countValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "white",
    padding: 1,
  },
});
