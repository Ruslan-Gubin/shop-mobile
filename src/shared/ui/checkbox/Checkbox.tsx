import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label?: string;
  isRect?: boolean;
  checked: boolean;
  onPress: () => void;
};

export const Checkbox = (props: Props) => {
  return (
    <Pressable onPress={props.onPress}>
      <View style={styles.root}>
        <View style={[styles.checkboxContainer, props.isRect && styles.rect]}>
          <View
            style={[
              styles.checkbox,
              props.checked && styles.checkboxActive,
              props.isRect && styles.rect,
            ]}
          >
            {props.checked && <View style={styles.checkIcon}></View>}
          </View>
        </View>
        {props.label && (
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{props.label}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    columnGap: 6,
    flexDirection: "row",
  },
  checkboxContainer: {
    backgroundColor: "white",
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 4,
  },
  checkbox: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#c8c8d1",
    alignItems: "center",
    justifyContent: "center",
  },
  rect: {
    borderRadius: "50%",
  },
  checkboxActive: {
    backgroundColor: "#a73afd",
    borderColor: "#a73afd",
  },
  checkIcon: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#ffffff",
    transform: "rotate(45deg)",
    marginBottom: 3,
  },

  labelContainer: {
    paddingTop: 2,
    flex: 1,
  },
  label: {
    lineHeight: 18,
  },
});
