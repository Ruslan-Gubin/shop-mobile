import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  maxLength?: number;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  phoneCodes?: string;
};

export const FieldInput = ({
  value,
  onChangeText,
  placeholder,
  error,
  maxLength,
  keyboardType = "default",
  phoneCodes,
}: Props) => {
  const [focused, setFocused] = useState(false);
  const showLabelTop = focused || value.length > 0;

  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        {showLabelTop && (
          <Text pointerEvents="none" style={[styles.labelTop, error ? styles.labelTopError : null]}>
            {placeholder}
          </Text>
        )}
        {phoneCodes && (
          <Text style={[styles.phoneCodes, value.length > 0 && styles.phoneCodesActive]}>+7</Text>
        )}
        <TextInput
          style={[styles.input, phoneCodes && styles.inputWithPrefix]}
          value={value}
          onChangeText={onChangeText}
          placeholder={showLabelTop ? "" : placeholder}
          placeholderTextColor="#b3b3b3"
          maxLength={maxLength}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    rowGap: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 12,
    backgroundColor: "#fff",
    position: "relative",
  },
  labelTop: {
    position: "absolute",
    top: -7,
    left: 12,
    zIndex: 1,
    fontSize: 11,
    color: "#171717",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
  },
  labelTopError: {
    color: "#ff4444",
  },
  phoneCodes: {
    paddingLeft: 14,
    fontSize: 15,
    color: "#b3b3b3",
  },
  phoneCodesActive: {
    color: "#171717",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#171717",
    paddingHorizontal: 12,
  },
  inputWithPrefix: {
    paddingLeft: 8,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#ff4444",
  },
});