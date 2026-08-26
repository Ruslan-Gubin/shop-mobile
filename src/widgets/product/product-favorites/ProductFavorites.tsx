import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HeartSvg } from "../../../shared/svg/HeartSvg";
import { favoritesAdapter } from "../../../store/favorites/adapter";
import { favoritesStore } from "../../../store/favorites/store";

type Props = {
  id: number;
  size?: number;
};

export const ProductFavorites = (props: Props) => {
  const active = favoritesStore((state) => state.items[props.id]) || 0;

  const handleToggleFavorite = (id: number) => favoritesAdapter.toggle(id);

  return (
    <View style={styles.favoritesContainer}>
      <TouchableOpacity style={styles.button} onPress={() => handleToggleFavorite(props.id)}>
        <HeartSvg
          size={props.size ? props.size : 24}
          active={typeof active === "number" && active > 0}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    zIndex: 1,
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
