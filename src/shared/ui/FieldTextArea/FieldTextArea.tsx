import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder: string;
  error?: string;
  maxLength?: number;
};

export const FieldTextArea = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  maxLength,
}: Props) => {
  return (
    <View style={styles.root}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, error && styles.containerError]}>
        <TextInput
          multiline
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b3b3b3"
          maxLength={maxLength}
          textAlignVertical="top"
          style={styles.input}
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
  container: {
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
  },
  containerError: {
    borderColor: "#ff6262",
  },
  input: {
    fontSize: 15,
    color: "#171717",
  },
  errorText: {
    fontSize: 12,
    color: "#ff4444",
  },
});
