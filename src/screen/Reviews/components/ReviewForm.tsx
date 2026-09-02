import { useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { fetchService } from "../../../shared/fetch-api";
import { declOfNum } from "../../../shared/helpers/declOfNum";
import type { ReviewModel } from "../../../shared/types/review";
import { FieldTextArea } from "../../../shared/ui/FieldTextArea/FieldTextArea";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

const STARS = [1, 2, 3, 4, 5];

const textOptional = () =>
  z.string().refine((val) => val.length === 0 || (val.length >= 10 && val.length <= 1000), {
    message: "Число символов от 10 до 1000",
  });

const createReviewSchema = z.object({
  rating: z
    .number({ message: "Поставьте оценку" })
    .min(1, { message: "Поставьте оценку" })
    .max(5, { message: "Оценка от 1 до 5" }),
  dignities: textOptional(),
  disadvantages: textOptional(),
  comment: textOptional(),
});

type ErrorsType = {
  rating: string;
  dignities: string;
  disadvantages: string;
  comment: string;
};

const EMPTY_ERRORS: ErrorsType = {
  rating: "",
  dignities: "",
  disadvantages: "",
  comment: "",
};

const EMPTY_VALUES = {
  rating: 0,
  dignities: "",
  disadvantages: "",
  comment: "",
};

type Props = {
  productId: number;
  myReview: ReviewModel | null;
  canReview: boolean;
  totalRating: number;
  totalCount: number;
  onChanged: () => void;
};

export const ReviewForm = (props: Props) => {
  const [active, setActive] = useState<boolean>(false);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState<ErrorsType>(EMPTY_ERRORS);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; subtitle: string }>({
    title: "",
    subtitle: "",
  });

  useLayoutEffect(() => {
    if (props.myReview) {
      setValues({
        rating: props.myReview.rating || 0,
        dignities: props.myReview.dignities || "",
        disadvantages: props.myReview.disadvantages || "",
        comment: props.myReview.comment || "",
      });
    }
  }, [props.myReview]);

  const { rating, dignities, disadvantages, comment } = values;

  const handleReset = () => {
    setActive(false);
    setErrors(EMPTY_ERRORS);
    setValues(EMPTY_VALUES);
  };

  const handleChangeValue = (value: string | number, key: keyof typeof values) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsSaved(false);
    setActive(true);
  };

  const applyServerErrors = (serverErrors: Record<string, unknown>) => {
    const updateErrors = { ...errors };

    for (const key in serverErrors) {
      const typedKey = key as keyof ErrorsType;
      if (Object.hasOwn(updateErrors, typedKey)) {
        updateErrors[typedKey] = String(serverErrors[key]);
      }
    }

    setErrors(updateErrors);
  };

  const submitReview = () => {
    const payload = {
      rating: values.rating,
      dignities: values.dignities.trim(),
      disadvantages: values.disadvantages.trim(),
      comment: values.comment.trim(),
      product_id: props.productId,
    };

    const validation = createReviewSchema.safeParse({
      rating: payload.rating,
      dignities: payload.dignities,
      disadvantages: payload.disadvantages,
      comment: payload.comment,
    });

    if (!validation.success) {
      const updateErrors = { ...errors };

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ErrorsType;
        updateErrors[field] = issue.message;
      });

      setErrors(updateErrors);
      return;
    }

    fetchService
      .post<ReviewModel>({ url: "product-review/create", payload })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setModalContent({
            title: "Спасибо за ваш отзыв",
            subtitle: "Отзыв будет опубликован после проверки",
          });
          setActive(false);
          handleReset();
          props.onChanged();
          setModalVisible(true);
        } else if (response.status === "error") {
          applyServerErrors(response.errors as unknown as Record<string, unknown>);
        }
      })
      .catch(() => {
        setModalContent({ title: "Не удалось создать отзыв", subtitle: "Попробуйте в другой раз" });
        setModalVisible(true);
      });
  };

  const submitEditReview = () => {
    if (!props.myReview?.id) {
      return;
    }

    const payload = {
      rating: values.rating,
      dignities: values.dignities.trim(),
      disadvantages: values.disadvantages.trim(),
      comment: values.comment.trim(),
    };

    const validation = createReviewSchema.safeParse(payload);

    if (!validation.success) {
      const updateErrors = { ...errors };

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ErrorsType;
        updateErrors[field] = issue.message;
      });

      setErrors(updateErrors);
      return;
    }

    fetchService
      .patch<ReviewModel>({ url: `product-review/${props.myReview.id}`, payload })
      .then((response) => {
        if (response.status === "success") {
          setModalContent({
            title: "Спасибо за ваш отзыв",
            subtitle: "Ваш отзыв успешно изменен",
          });
          setActive(false);
          setIsSaved(true);
          props.onChanged();
          setModalVisible(true);
        } else if (response.status === "error") {
          applyServerErrors(response.errors as unknown as Record<string, unknown>);
        }
      })
      .catch(() => {
        setModalContent({
          title: "Не удалось изменить отзыв",
          subtitle: "Попробуйте в другой раз",
        });
        setModalVisible(true);
      });
  };

  const submitDeleteReview = () => {
    if (!props.myReview?.id) {
      return;
    }

    fetchService
      .delete<null>({ url: `product-review/${props.myReview.id}` })
      .then((response) => {
        if (response.status === "success") {
          setDeleteModalVisible(false);
          setActive(false);
          handleReset();
          props.onChanged();
        } else if (response.status === "error") {
          setModalContent({ title: "Не удалось удалить отзыв", subtitle: response.message });
          setModalVisible(true);
        }
      })
      .catch(() => {
        setModalContent({ title: "Не удалось удалить отзыв", subtitle: "Попробуйте в другой раз" });
        setModalVisible(true);
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const isNewUser = props.myReview === null;

  return (
    <View style={styles.root}>
      <BaseModal
        visible={modalVisible}
        title={modalContent.title}
        subtitleText={modalContent.subtitle}
        onClose={handleCloseModal}
        footerAction={{
          submit: {
            text: "Закрыть",
            action: handleCloseModal,
            backgroundColor: "#a73afd",
          },
        }}
      />

      <BaseModal
        visible={deleteModalVisible}
        title="Вы точно хотите удалить отзыв?"
        subtitleText="Отменить данное действие будет невозможно"
        onClose={() => setDeleteModalVisible(false)}
        footerAction={{
          cancel: {
            text: "Отменить",
            action: () => setDeleteModalVisible(false),
            backgroundColor: "#f6f6f9",
          },
          submit: {
            text: "Удалить",
            action: submitDeleteReview,
            backgroundColor: "#cd5c5c",
            color: "white",
          },
        }}
      />

      {props.totalRating > 0 && props.totalCount > 0 && (
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingInfoValue}>{props.totalRating}</Text>
          <View style={styles.totalRatingStars}>
            {STARS.map((star) => (
              <Text
                key={star}
                style={[
                  styles.totalStar,
                  star <= Math.round(props.totalRating)
                    ? styles.totalStarActive
                    : styles.totalStarInactive,
                ]}
              >
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.ratingInfoCount}>
            {props.totalCount} {declOfNum(props.totalCount, ["оценка", "оценки", "оценок"])}
          </Text>
        </View>
      )}

      {props.canReview && (
        <>
          {!isNewUser && <Text style={styles.yourRatingTitle}>Ваша оценка</Text>}
          <View style={styles.ratingContainer}>
            <View style={styles.starsRow}>
              {STARS.map((star) => (
                <Pressable
                  key={star}
                  accessibilityRole="button"
                  accessibilityLabel={`Оценка ${star} из 5`}
                  hitSlop={4}
                  onPress={() => handleChangeValue(star, "rating")}
                >
                  <Text
                    style={[styles.star, star <= rating ? styles.starActive : styles.starInactive]}
                  >
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
          </View>

          {active && (
            <View style={styles.fieldsContainer}>
              <FieldTextArea
                value={dignities}
                onChangeText={(value) => handleChangeValue(value, "dignities")}
                label="Достоинства"
                placeholder="Что вам понравилось"
                error={errors.dignities}
                maxLength={1000}
              />
              <FieldTextArea
                value={disadvantages}
                onChangeText={(value) => handleChangeValue(value, "disadvantages")}
                label="Недостатки"
                placeholder="Что не понравилось"
                error={errors.disadvantages}
                maxLength={1000}
              />
              <FieldTextArea
                value={comment}
                onChangeText={(value) => handleChangeValue(value, "comment")}
                label="Комментарий"
                placeholder="Ваш комментарий"
                error={errors.comment}
                maxLength={1000}
              />
            </View>
          )}

          {active && isNewUser && rating > 0 && (
            <View style={styles.footerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={submitReview}
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonViolet,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.buttonVioletText}>Оставить отзыв</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonGray,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.buttonGrayText}>Отменить</Text>
              </Pressable>
            </View>
          )}

          {!isNewUser && !isSaved && (
            <View style={styles.footerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => (active ? submitEditReview() : setActive(true))}
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonViolet,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.buttonVioletText}>Изменить отзыв</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDeleteModalVisible(true)}
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonGray,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.buttonGrayText}>Удалить</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    rowGap: 12,
  },
  ratingInfo: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  ratingInfoValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#242424",
  },
  totalRatingStars: {
    flexDirection: "row",
    columnGap: 1,
  },
  totalStar: {
    fontSize: 16,
  },
  totalStarActive: {
    color: "#fca95d",
  },
  totalStarInactive: {
    color: "#c8c8d1",
  },
  ratingInfoCount: {
    fontSize: 12,
    color: "#868695",
  },
  ratingContainer: {
    rowGap: 4,
  },
  starsRow: {
    flexDirection: "row",
    columnGap: 6,
  },
  star: {
    fontSize: 28,
  },
  starActive: {
    color: "#fca95d",
  },
  starInactive: {
    color: "#c8c8d1",
  },
  yourRatingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#242424",
  },
  fieldsContainer: {
    rowGap: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#ff4444",
  },
  footerActions: {
    flexDirection: "row",
    columnGap: 12,
  },
  button: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  buttonViolet: {
    backgroundColor: "#a73afd",
  },
  buttonVioletText: {
    color: "white",
    fontWeight: "800",
  },
  buttonGray: {
    backgroundColor: "#f1f1f5",
  },
  buttonGrayText: {
    color: "#242424",
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.6,
  },
});
