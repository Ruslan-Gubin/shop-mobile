import { StyleSheet, View } from "react-native";
import { getFormattedPhone } from "../../../shared/helpers/getFormattedPhone";
import { FieldInput } from "../../../shared/ui/FieldInput/FieldInput";
import { FieldTextArea } from "../../../shared/ui/FieldTextArea/FieldTextArea";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import { checkoutStore } from "../../../store/checkout/store";
import { InfoCard } from "./InfoCard";

export const AdditionalInformation = () => {
  const comment = checkoutStore((store) => store.comment);
  const recipient_name = checkoutStore((store) => store.recipient_name);
  const phone = checkoutStore((store) => store.phone);
  const comment_error = checkoutStore((store) => store.comment_error);
  const recipient_name_error = checkoutStore((store) => store.recipient_name_error);
  const phone_error = checkoutStore((store) => store.phone_error);

  const handleChangeValues = (value: string, key: "recipient_name" | "phone" | "comment") => {
    checkoutAdapter.changeAdditionalInfoInputs(value, key);
  };

  const handleChangePhone = (value: string) => {
    checkoutAdapter.changeAdditionalInfoInputs(getFormattedPhone(value), "phone");
  };

  return (
    <InfoCard title="Дополнительная информация">
      <View style={styles.root}>
        <FieldInput
          error={recipient_name_error}
          label="Имя получателя"
          onChangeText={(value) => handleChangeValues(value, "recipient_name")}
          placeholder="Введите имя"
          maxLength={50}
          value={recipient_name}
        />
        <FieldInput
          error={phone_error}
          label="Телефон получателя"
          phoneCodes="+7"
          onChangeText={handleChangePhone}
          placeholder="Введите телефон"
          keyboardType="phone-pad"
          maxLength={13}
          value={phone}
        />
        <FieldTextArea
          error={comment_error}
          label="Комментарий"
          onChangeText={(value) => handleChangeValues(value, "comment")}
          placeholder="Введите комментарий"
          maxLength={1000}
          value={comment}
        />
      </View>
    </InfoCard>
  );
};

const styles = StyleSheet.create({
  root: {
    rowGap: 12,
  },
});

