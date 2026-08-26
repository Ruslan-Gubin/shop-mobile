import { StyleSheet, Text, View } from "react-native";

export const MovieDetailsScreen = (props: any) => {
  const name = props.route.name;
  const params = props.route.params;

  console.log(name, params);

  return (
    <View style={styles.container}>
      <Text>
        MovieDetailsScreen - name: {name}, params: {params}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
