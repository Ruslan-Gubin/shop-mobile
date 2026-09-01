import { StyleSheet, Text, View } from "react-native";
import { formatDateLong } from "../../../shared/helpers/formatters";
import type { ReviewModel } from "../../../shared/types/review";

const STARS = [1, 2, 3, 4, 5];

type Props = {
  item: ReviewModel;
  width?: number;
  numberOfLines?: number;
};

export const ReviewCard = (props: Props) => {
  const review = props.item;

  return (
    <View style={[styles.card, props.width ? { width: props.width } : null]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardAuthor}>Пользователь</Text>
          <Text style={styles.cardDate}>
            {review.created_at ? formatDateLong(review.created_at) : ""}
          </Text>
        </View>
        <View style={styles.starsRow}>
          {STARS.map((star) => (
            <Text
              key={star}
              style={[styles.star, star <= review.rating ? styles.starActive : styles.starInactive]}
            >
              ★
            </Text>
          ))}
        </View>
      </View>

      {review.dignities.length > 0 && (
        <Text numberOfLines={props.numberOfLines} style={styles.cardText}>
          <Text style={styles.cardLabel}>Достоинства: </Text>
          <Text>{review.dignities}</Text>
        </Text>
      )}
      {review.disadvantages.length > 0 && (
        <Text numberOfLines={props.numberOfLines} style={styles.cardText}>
          <Text style={styles.cardLabel}>Недостатки: </Text>
          <Text>{review.disadvantages}</Text>
        </Text>
      )}
      {review.comment.length > 0 && (
        <Text numberOfLines={props.numberOfLines} style={styles.cardText}>
          <Text style={styles.cardLabel}>Комментарий: </Text>
          <Text>{review.comment}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#f1f1f5",
    borderRadius: 12,
    padding: 12,
    rowGap: 8,
    maxHeight: 210,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 8,
  },
  cardHeaderLeft: {
    flex: 1,
    rowGap: 2,
  },
  cardAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#242424",
  },
  cardDate: {
    fontSize: 11,
    color: "#6f6f77",
  },
  starsRow: {
    flexDirection: "row",
    columnGap: 1,
  },
  star: {
    fontSize: 13,
  },
  starActive: {
    color: "#fca95d",
  },
  starInactive: {
    color: "#c8c8d1",
  },
  cardText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#242424",
  },
  cardLabel: {
    fontWeight: "600",
  },
});
