import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import { basketStore } from "../../../store/basket/store";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "Basket">;
};

export const BasketFooter = (props: Props) => {
  const selected = basketStore((store) => store.selected);
  const disabledSubmit = selected.length === 0;
  const total = 238;

  return (
    <View style={styles.footer}>
      <Pressable
        disabled={disabledSubmit}
        onPress={() => props?.navigation.push("Checkout")}
        style={[styles.footerButton, !disabledSubmit && styles.footerButtonActive]}
      >
        <Text style={[styles.footerButtonText, !disabledSubmit && styles.footerButtonTextActive]}>
          {disabledSubmit ? "Выберите товары" : `К оформлению: ${selected.length || ""}`}
        </Text>

        {!disabledSubmit && (
          <Text
            style={[styles.footerButtonText, !disabledSubmit && styles.footerButtonTextActiveTotal]}
          >
            {formatterRub.format(total)}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingBlock: 8,
    paddingInline: 6,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    backgroundColor: "white",
  },
  footerButton: {
    backgroundColor: "#f6f6f9",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  footerButtonActive: {
    backgroundColor: "#f86c25",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingInline: 12,
  },
  footerButtonText: {
    color: "#d2d2e0",
    fontWeight: 600,
  },
  footerButtonTextActive: {
    color: "white",
    fontSize: 13,
  },
  footerButtonTextActiveTotal: {
    color: "white",
    fontSize: 14,
  },
});
