import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";
import { AddBasketLarge } from "../../../widgets/product/add-basket-large/AddBasketLarge";

type Props = {
  id: number;
  available: number | null;
  accounting: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const ProductInfoFooter = (props: Props) => {
  const count = basketStore((state) => state.items[props.id]) || 0;

  const handleAddBasket = (id: number) => basketAdapter.add(id);

  const handleBuyNow = (id: number) => {
    if (typeof props?.navigation?.push === "function") {
      if (count <= 0) {
        handleAddBasket(id);
      }
      props.navigation.navigate("CartStack");
    }
  };

  const hasStocks =
    !props.accounting ||
    (typeof props.available === "number" && props.accounting && props.available > 0);

  return (
    <View style={styles.root}>
      {hasStocks ? (
        <>
          <Pressable style={styles.goToBasketButton} onPress={() => handleBuyNow(props.id)}>
            <Text style={styles.buttonText}>Купить сейчас</Text>
          </Pressable>

          <View style={styles.buttonContainer}>
            {count > 0 ? (
              <AddBasketLarge
                variant="violet"
                accounting={props.accounting}
                available={props.available}
                id={props.id}
              />
            ) : (
              <Pressable
                style={[styles.goToBasketButton, styles.addBasketButton]}
                onPress={() => handleAddBasket(props.id)}
              >
                <Text style={styles.buttonText}>В козину</Text>
              </Pressable>
            )}
          </View>
        </>
      ) : (
        <Pressable style={[styles.goToBasketButton, styles.goToBasketButtonDisabled]}>
          <Text style={[styles.buttonText, styles.buttonTextDisabled]}>Нет в наличии</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingInline: 12,
    paddingBlock: 6,
    justifyContent: "space-between",
    alignItems: "center",
    rowGap: 12,
    columnGap: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  buttonContainer: {
    flex: 1,
  },
  goToBasketButton: {
    flex: 1,
    backgroundColor: "#f86c25",
    borderRadius: 12,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  addBasketButton: {
    backgroundColor: "#a73afd",
  },
  goToBasketButtonDisabled: {
    backgroundColor: "lightgray",
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: "gray",
  },
});
