import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { ProductFavorites } from "../../../widgets/product/product-favorites/ProductFavorites";
import { ArrowBackIcon } from "../../svg/ArrowBackIcon";

type Props = {
  title: string;
  onBack: () => void;
  children?: React.ReactNode;
  isShowFavorites?: boolean;
  id?: number;
};

const CARD_WIDTH = Dimensions.get("window").width;

export const PageHeader = (props: Props) => {
  return (
    <View style={styles.header}>
      <View style={[styles.leftSide, {}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={8}
          onPress={props.onBack}
          style={styles.buttonBackIcon}
        >
          <ArrowBackIcon fill="black" size={24} />
        </Pressable>
        <Text numberOfLines={1} style={[styles.title, { maxWidth: CARD_WIDTH - 108 }]}>
          {props.title}
        </Text>
      </View>
      {props.isShowFavorites && props.id && (
        <View style={styles.rightSide}>
          <ProductFavorites id={props.id} svgSize={20} size={24} top={0} right={0} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 16,
    paddingInline: 12,
    paddingBlock: 6,
    backgroundColor: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    flex: 1,
  },
  rightSide: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonBackIcon: {
    borderRadius: 8,
    backgroundColor: "#f1f1f5",
  },
});
