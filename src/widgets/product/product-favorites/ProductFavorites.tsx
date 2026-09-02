import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HeartSvg } from "../../../shared/svg/HeartSvg";
import { favoritesAdapter } from "../../../store/favorites/adapter";
import { favoritesStore } from "../../../store/favorites/store";

type Props = {
  id: number;
  svgSize?: number;
  size?: number;
  top?: number;
  right?: number;
};

export const ProductFavorites = (props: Props) => {
  const active = favoritesStore((state) => state.items[props.id]) || 0;

  const handleToggleFavorite = (id: number) => favoritesAdapter.toggle(id);

  return (
    <View
      style={[
        styles.favoritesContainer,
        {
          width: props.size || 30,
          height: props.size || 30,
          top: typeof props.top === "number" ? props.top : 8,
          right: typeof props.right === "number" ? props.right : 8,
        },
      ]}
    >
      <TouchableOpacity
        hitSlop={8}
        style={styles.button}
        onPress={() => handleToggleFavorite(props.id)}
      >
        <HeartSvg size={props.svgSize || 24} active={typeof active === "number" && active > 0} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    position: "absolute",
    zIndex: 1,
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
