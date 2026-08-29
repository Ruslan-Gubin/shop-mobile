import { StyleSheet, Text, View } from "react-native";
import { basketStore } from "../store/basket/store";

export const CountBasket = () => {
  const basket = basketStore((store) => store.items);
  const basketCount = Object.values(basket).length || 0;

  return (
    <>
      {basketCount > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countValue}>{basketCount < 100 ? basketCount : "99+"}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  countContainer: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 35,
    alignItems: "flex-end",
    overflow: "hidden",
    flexWrap: "nowrap",
    zIndex: 1,
  },
  countValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "white",
    textAlign: "center",
    overflow: "hidden",
    paddingInline: 2,
    paddingBlock: 1,
    minWidth: 15,
    borderRadius: "50%",
    backgroundColor: "red",
  },
});
