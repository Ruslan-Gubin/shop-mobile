import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { PhotoModel } from "../../../shared/types/photo";
import { ImageMain } from "../../../shared/ui/image/ImageMain";

type SegmentKey = "waiting" | "reviews" | "questions";

type Props = {
  id: number;
  name: string;
  description: string;
  brand_name: string;
  photos: PhotoModel[];
  activeTab: SegmentKey;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const UserProductCard = (props: Props) => {
  const handlePress = () => {
    if (
      typeof props.id === "number" &&
      props.id > 0 &&
      typeof props.navigation?.push === "function"
    ) {
      const path = props.activeTab === "questions" ? "UserProductQuestions" : "UserProductReview";
      props.navigation.push(path, { id: props.id });
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.name || "Товар"}
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <ImageMain uri={props.photos?.[0]?.url || ""} style={styles.image} />

        <View style={styles.productInfo}>
          {props.brand_name.length > 0 && <Text style={styles.brand}>{props.brand_name}</Text>}
          {props.name.length > 0 && (
            <Text numberOfLines={1} style={styles.productName}>
              {props.name}
            </Text>
          )}
          {props.description.length > 0 && (
            <Text numberOfLines={2} style={styles.productDescription}>
              {props.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    rowGap: 8,
  },
  cardPressed: {
    opacity: 0.7,
  },
  brand: {
    fontSize: 13,
    fontWeight: "600",
    color: "#868695",
    textTransform: "uppercase",
  },
  content: {
    flexDirection: "row",
    columnGap: 12,
    alignItems: "flex-start",
  },
  image: {
    width: 72,
    height: 96,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    rowGap: 2,
    minWidth: 0,
    overflow: "hidden",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#242424",
  },
  productDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#868695",
  },
});
