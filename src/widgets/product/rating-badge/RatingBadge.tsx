import { StyleSheet, Text, View } from "react-native";
import { declOfNum } from "../../../shared/helpers/declOfNum";
import { ReviewSvg } from "../../../shared/svg/ReviewSvg";

type Props = {
  rating: number;
  reviewCount: number;
};

export const RatingBadge = (props: Props) => {
  return (
    <View style={styles.root}>
      <View>
        <ReviewSvg fill="#ff8533" />
      </View>
      <Text>
        {props.rating}{" "}
        <Text style={styles.count}>
          {props.reviewCount} {declOfNum(props.reviewCount, ["оценка", "оценки", "оценок"])}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    columnGap: 4,
    color: "inherit",
    flexWrap: "wrap",
    alignItems: "center",
  },

  count: {
    color: "#8a8999",
    fontSize: 12,
  },
});
