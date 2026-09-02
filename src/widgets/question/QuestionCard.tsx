import { StyleSheet, Text, View } from "react-native";
import { formatDateLong } from "../../shared/helpers/formatters";
import type { QuestionModel } from "../../shared/types/question";

type Props = {
  item: QuestionModel;
  width?: number;
  numberOfLines?: number;
  backgroundColor?: string;
};

export const QuestionCard = (props: Props) => {
  const questionItem = props.item;

  return (
    <View
      style={[
        styles.card,
        { width: props.width || undefined, backgroundColor: props.backgroundColor || "#f1f1f5" },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardAuthor}>Пользователь</Text>
          <Text style={styles.cardDate}>
            {questionItem.created_at ? formatDateLong(questionItem.created_at) : ""}
          </Text>
        </View>
      </View>

      <Text numberOfLines={props.numberOfLines} style={styles.cardText}>
        {questionItem.question}
      </Text>
      {questionItem.answer.length > 0 && (
        <Text numberOfLines={props.numberOfLines} style={styles.cardText}>
          <Text style={styles.cardLabel}>Ответ: </Text>
          {questionItem.answer}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    rowGap: 8,
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
  cardText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#242424",
  },
  cardLabel: {
    fontWeight: "600",
  },
});
