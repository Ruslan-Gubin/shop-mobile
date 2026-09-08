import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { fetchService } from "../../../shared/fetch-api";
import { getMessageError } from "../../../shared/helpers/getMessageError";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  id: number;
  navigation?: NativeStackNavigationProp<ParamListBase, string>;
};

export const CancelOrderModal = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  const PRESET_REASONS = [
    "Передумал",
    "Оформил случайно",
    "Нашёл дешевле",
    "Слишком долго ждать",
    "Хочу изменить заказ",
    "Товар больше не нужен",
  ];

  const finalReason = customReason.trim() || selectedReason;
  const isDisabled = finalReason.length === 0 || loading;

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setOpen(false);
  };

  const handleSelectPreset = (reason: string) => {
    setCustomReason("");
    setSelectedReason((prev) => (prev === reason ? "" : reason));
  };

  const handleSubmit = () => {
    setLoading(true);

    fetchService
      .patch<null>({
        url: `orders/reject/${props.id}`,
        payload: { rejected_reason: finalReason },
      })
      .then((response) => {
        if (response.status === "success") {
          handleClose();
          props.navigation?.reset({ index: 0, routes: [{ name: "Orders" }] });
        } else {
          throw response.message;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось отменить заказ");

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: () => {
              handleSubmit();
            },
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleChangeInput = (value: string) => {
    setCustomReason(value);
    if (selectedReason.length > 0) {
      setSelectedReason("");
    }
  };

  return (
    <>
      <BaseModal
        visible={open}
        onClose={handleClose}
        title="Отмена заказа"
        subtitleText="Укажите причину отмены или выберите из предложенного."
        footerAction={{
          cancel: { text: "Отмена", action: handleClose, backgroundColor: "#f6f6f9" },
          submit: {
            text: "Отменить заказ",
            action: handleSubmit,
            backgroundColor: "#cd5c5c",
            disabled: isDisabled,
          },
        }}
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Введите свою причину"
            placeholderTextColor="#999"
            multiline
            maxLength={255}
            value={customReason}
            onChangeText={handleChangeInput}
          />
          <ScrollView
            style={{ flexGrow: 0 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            contentContainerStyle={styles.presetList}
          >
            {PRESET_REASONS.map((reason) => (
              <Pressable
                key={reason}
                style={[styles.presetChip, selectedReason === reason && styles.presetChipActive]}
                onPress={() => handleSelectPreset(reason)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    selectedReason === reason && styles.presetChipTextActive,
                  ]}
                >
                  {reason}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </BaseModal>

      <Pressable style={styles.cancelButton} onPress={() => setOpen(true)} hitSlop={8}>
        <Text style={styles.cancelButtonText}>Отменить заказ</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingTop: 12,
    rowGap: 16,
  },
  presetList: {
    columnGap: 8,
    paddingVertical: 2,
  },
  presetChip: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#f1f1f5",
  },
  presetChipActive: {
    borderColor: "#a73afd",
    backgroundColor: "#a73afd10",
  },
  presetChipText: {
    fontSize: 14,
    color: "#242424",
  },
  presetChipTextActive: {
    color: "#a73afd",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#242424",
    maxHeight: 255,
  },
  cancelButton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  cancelButtonText: {
    color: "#cd5c5c",
    fontWeight: 500,
    borderColor: "#cd5c5c",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
