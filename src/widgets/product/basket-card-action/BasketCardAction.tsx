import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { DeleteSvg } from "../../../shared/svg/DeleteSvg";
import { HeartSvg } from "../../../shared/svg/HeartSvg";
import { favoritesAdapter } from "../../../store/favorites/adapter";
import { favoritesStore } from "../../../store/favorites/store";
import { modalsAdapter } from "../../../store/modals/adapter";

type Props = {
  id: number;
  size?: number;
};

export const BasketCardAction = (props: Props) => {
  const active = favoritesStore((state) => state.items[props.id]) || 0;

  const handleToggleFavorite = (id: number) => favoritesAdapter.toggle(id);
  const handleSelectDeleteItem = (id: number) => modalsAdapter.deleteItem(id);

  return (
    <View style={styles.favoritesContainer}>
      <TouchableOpacity style={styles.button} onPress={() => handleToggleFavorite(props.id)}>
        <HeartSvg size={20} active={typeof active === "number" && active > 0} fill="gray" />
      </TouchableOpacity>

      <Pressable onPress={() => handleSelectDeleteItem(props.id)} style={styles.button}>
        <DeleteSvg size={20} fill="gray" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  favoritesContainer: {
    flexDirection: "row",
    columnGap: 12,
    justifyContent: "flex-end",
  },
  button: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
