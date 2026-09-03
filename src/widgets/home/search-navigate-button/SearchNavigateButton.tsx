import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SearchSvg } from "../../../shared/svg/SearchSvg";

type Props = {
  onPress: () => void;
};

export const SearchNavigateButton = (props: Props) => {
  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity style={styles.searchButton} onPress={props.onPress}>
        <SearchSvg size={18} fill="#9a1cc6" />
        <Text style={styles.searchText}>Поиск</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    borderEndEndRadius: 20,
    borderEndStartRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    padding: 12,
    paddingTop: 6,
  },
  searchButton: {
    backgroundColor: "rgba(183, 52, 228, 0.14)",
    width: "100%",
    height: 40,
    padding: 4,
    borderRadius: 12,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 12,
    paddingInline: 16,
  },
  searchText: {
    color: "#9a1cc6",
    fontWeight: 500,
    fontSize: 14,
  },
});
