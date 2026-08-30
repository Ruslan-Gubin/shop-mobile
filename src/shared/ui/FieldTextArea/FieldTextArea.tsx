import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  maxLength?: number;
};

export const FieldTextArea = ({ value, onChangeText, placeholder, error, maxLength }: Props) => {
  const [focused, setFocused] = useState(false);
  const showLabelTop = focused || value.length > 0;

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.container,
          error ? styles.containerError : null,
          focused && !error ? styles.containerFocused : null,
        ]}
      >
        {showLabelTop && (
          <Text pointerEvents="none" style={styles.labelTop}>
            {placeholder}
          </Text>
        )}
        <TextInput
          multiline
          value={value}
          onChangeText={onChangeText}
          placeholder={showLabelTop ? "" : placeholder}
          placeholderTextColor="#b3b3b3"
          maxLength={maxLength}
          textAlignVertical="top"
          style={styles.input}
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
  container: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
    position: "relative",
  },
  containerError: {
    borderColor: "#ff6262",
  },
  containerFocused: {
    borderColor: "#757575",
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
  input: {
    fontSize: 15,
    color: "#171717",
    lineHeight: 20,
    minHeight: 60,
  },
  errorText: {
    fontSize: 12,
    color: "#ff4444",
  },
});