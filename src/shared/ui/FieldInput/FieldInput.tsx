import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder: string;
  error?: string;
  maxLength?: number;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  phoneCodes?: string;
};

export const FieldInput = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  maxLength,
  keyboardType = "default",
  phoneCodes,
}: Props) => {
  return (
    <View style={styles.root}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {phoneCodes && <Text style={styles.phoneCodes}>+7</Text>}
        <TextInput
          style={[styles.input, phoneCodes && styles.inputWithPrefix]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b3b3b3"
          maxLength={maxLength}
          keyboardType={keyboardType}
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
  label: {
    fontSize: 13,
    color: "#868695",
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  inputContainerError: {
    borderColor: "#ff6262",
  },
  phoneCodes: {
    paddingLeft: 14,
    fontSize: 15,
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

