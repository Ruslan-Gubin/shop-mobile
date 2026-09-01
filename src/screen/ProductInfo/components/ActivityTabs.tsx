import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { declOfNum } from "../../../shared/helpers/declOfNum";
import { QuestionSvg } from "../../../shared/svg/QuestionSvg";
import { ReviewSvg } from "../../../shared/svg/ReviewSvg";
import type { QuestionCollection, ReviewCollection } from "../types";
import { QuestionCard } from "./QuestionCard";
import { ReviewCard } from "./ReviewCard";

type Props = {
  id: number;
  reviews: ReviewCollection;
  questions: QuestionCollection;
  canReview: boolean;
  navigation?: NativeStackNavigationProp<ParamListBase>;
};

export const ActivityTabs = (props: Props) => {
  const CARD_WIDTH = Dimensions.get("window").width;

  const hasReviews = Array.isArray(props.reviews.reviews) && props.reviews.reviews.length > 0;
  const hasQuestions =
    Array.isArray(props.questions.questions) && props.questions.questions.length > 0;

  const reviewsCount = props.reviews.totalCount;
  const questionsCount = props.questions.totalCount;
  const reviewsDisabled = !props.canReview && reviewsCount === 0;

  return (
    <View style={styles.card}>
      <View style={styles.tabsRow}>
        <Pressable
          accessibilityRole="button"
          disabled={reviewsDisabled}
          onPress={() => props.navigation?.push("ReviewsScreen", { id: props.id })}
          style={({ pressed }) => [
            styles.tabItem,
            pressed && !reviewsDisabled && styles.tabItemPressed,
          ]}
        >
          <View style={styles.tabHeader}>
            <ReviewSvg fill="#a73afd" size={18} />
            <Text style={styles.tabTitle}>Отзывы</Text>
          </View>
          <Text style={styles.tabCount}>
            {reviewsCount} {declOfNum(reviewsCount, ["отзыв", "отзыва", "отзывов"])}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => props.navigation?.push("QuestionsScreen", { id: props.id })}
          style={({ pressed }) => [styles.tabItem, pressed && styles.tabItemPressed]}
        >
          <View style={styles.tabHeader}>
            <QuestionSvg fill="#a73afd" size={18} />
            <Text style={styles.tabTitle}>Вопросы</Text>
          </View>
          <Text style={styles.tabCount}>
            {questionsCount} {declOfNum(questionsCount, ["вопрос", "вопроса", "вопросов"])}
          </Text>
        </Pressable>
      </View>

      {hasReviews && (
        <FlatList
          data={props.reviews.reviews}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={CARD_WIDTH - 20}
          decelerationRate="fast"
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ReviewCard numberOfLines={2} item={item} width={CARD_WIDTH - 24} />
          )}
        />
      )}

      {!hasReviews && hasQuestions && (
        <FlatList
          data={props.questions.questions}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={CARD_WIDTH - 20}
          decelerationRate="fast"
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <QuestionCard numberOfLines={2} item={item} width={CARD_WIDTH - 24} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    paddingBlock: 12,
    rowGap: 12,
  },
  tabsRow: {
    flexDirection: "row",
    columnGap: 8,
    paddingInline: 12,
  },
  tabItem: {
    flex: 1,
    backgroundColor: "#f1f1f5",
    borderRadius: 10,
    paddingInline: 12,
    paddingBlock: 10,
    rowGap: 4,
  },
  tabItemPressed: {
    opacity: 0.6,
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#242424",
  },
  tabCount: {
    fontSize: 12,
    color: "#6f6f77",
  },
  listContent: {
    paddingInline: 12,
    columnGap: 4,
  },
});
