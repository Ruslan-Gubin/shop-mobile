import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import type { QuestionModel } from "../../../shared/types/question";
import { FieldTextArea } from "../../../shared/ui/FieldTextArea/FieldTextArea";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  id: number;
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 1000;

export const QuestionsForm = (props: Props) => {
  const [question, setQuestion] = useState<string>("");
  const [questionError, setQuestionError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; subtitle: string }>({
    title: "",
    subtitle: "",
  });

  const submitQuestions = () => {
    if (question.trim().length < MIN_LENGTH) {
      setQuestionError(`Число символов от ${MIN_LENGTH} до ${MAX_LENGTH}`);
      return;
    }

    fetchService
      .post<QuestionModel>({
        url: "product-question/create",
        payload: { question: question.trim(), product_id: props.id },
      })
      .then((response) => {
        if (response.status === "success" && response.data) {
          setModalContent({
            title: "Спасибо за ваш вопрос",
            subtitle: "Вопрос будет опубликован вместе с ответом",
          });
          setQuestion("");
          setQuestionError("");
        } else {
          const message = getMessageError(response.message, "Не удалось создать вопрос");
          setModalContent({ title: "Не удалось создать вопрос", subtitle: message });
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось создать вопрос");
        setModalContent({ title: "Не удалось создать вопрос", subtitle: message });
      })
      .finally(() => {
        setModalVisible(true);
      });
  };

  const handleChangeQuestion = (value: string) => {
    setQuestion(value);
    if (questionError) {
      setQuestionError("");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const disabled = question.trim().length < MIN_LENGTH || question.trim().length > MAX_LENGTH;

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

      <FieldTextArea
        value={question}
        onChangeText={handleChangeQuestion}
        label="Ваш вопрос"
        placeholder="Любой вопрос о товаре"
        error={questionError}
        maxLength={MAX_LENGTH}
      />

      <Pressable
        accessibilityRole="button"
        onPress={submitQuestions}
        style={[styles.button, styles.buttonViolet, disabled && styles.buttonDisabled]}
        disabled={disabled}
      >
        <Text style={[styles.buttonVioletText, disabled && styles.buttonVioletTextDisabled]}>
          Задать вопрос
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    minHeight: 0,
    borderRadius: 12,
    padding: 12,
    rowGap: 12,
  },
  button: {
    flex: 1,
    height: 36,
    maxHeight: 36,
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
  buttonVioletTextDisabled: {
    color: "gray",
  },
  buttonDisabled: {
    backgroundColor: "lightgray",
    opacity: 0.4,
  },
});
