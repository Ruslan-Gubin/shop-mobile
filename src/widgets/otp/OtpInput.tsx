import type { ElementRef } from 'react';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  editable?: boolean;
  error?: boolean;
};

export const OtpInput = ({
  value,
  onChangeText,
  length = 6,
  editable = true,
  error = false,
}: Props) => {
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const digits = value.split('').slice(0, length);

  const handlePressContainer = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.root}>
      <Pressable style={styles.boxes} onPress={handlePressContainer}>
        {Array.from({ length }).map((_, index) => {
          const digit = digits[index] || '';
          const isFilled = Boolean(digit);
          const isActive = !isFilled && index === digits.length;

          return (
            <View
              key={index}
              style={[
                styles.box,
                isFilled && styles.boxFilled,
                isActive && styles.boxActive,
                error && styles.boxError,
              ]}
            >
              <Text style={styles.digit}>{digit}</Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={length}
        editable={editable}
        autoFocus
        caretHidden
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  boxes: {
    flexDirection: 'row',
    columnGap: 8,
  },
  box: {
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#cecece',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  boxFilled: {
    borderColor: '#a73afd',
  },
  boxActive: {
    borderColor: '#a73afd',
  },
  boxError: {
    borderColor: '#e0245e',
  },
  digit: {
    fontSize: 20,
    fontWeight: '600',
    color: '#171717',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
