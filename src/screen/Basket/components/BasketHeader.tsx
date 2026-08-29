import { Pressable, StyleSheet, View } from "react-native";
import { DeleteSvg } from "../../../shared/svg/DeleteSvg";
import { HeartSvg } from "../../../shared/svg/HeartSvg";
import { Checkbox } from "../../../shared/ui/checkbox/Checkbox";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";
import { favoritesAdapter } from "../../../store/favorites/adapter";
import { favoritesStore } from "../../../store/favorites/store";
import { modalsAdapter } from "../../../store/modals/adapter";

export const BasketHeader = () => {
  const selected = basketStore((store) => store.selected);
  const favorites = favoritesStore((store) => store.items);
  const totalCount = basketStore((store) => store.totalCount);
  const isSelectAllBasket = selected.length === totalCount;

  const handleChangeAllSelect = () => {
    if (isSelectAllBasket) {
      basketAdapter.cancelAll();
    } else {
      basketAdapter.selectAll();
    }
  };

  const getIsSelectAllFavorites = () => {
    let select = selected.length > 0;

    for (let i = 0; i < selected.length; i++) {
      const id = selected[i];
      if (!Object.hasOwn(favorites, id)) {
        select = false;
      }
    }

    return select;
  };

  const isSelectAllFavorites = getIsSelectAllFavorites();

  const handleAddFavorites = () => {
    if (isSelectAllFavorites) {
      favoritesAdapter.cancelMany(selected);
    } else {
      favoritesAdapter.addMany(selected);
    }
  };

  const handleDeleteItems = (ids: number[]) => modalsAdapter.deleteMany(ids);

  return (
    <View style={styles.header}>
      <View style={{ flex: 0.5 }}>
        <Checkbox
          checked={totalCount > 0 && isSelectAllBasket}
          label="Все"
          onPress={handleChangeAllSelect}
        />
      </View>
      <View style={styles.headerRightSide}>
        <Pressable
          disabled={selected.length === 0}
          onPress={handleAddFavorites}
          style={styles.headerIconButton}
        >
          <HeartSvg
            active={isSelectAllFavorites}
            size={20}
            fill={selected.length > 0 ? "gray" : "#c8c8d1"}
          />
        </Pressable>
        <Pressable
          disabled={selected.length === 0}
          onPress={() => handleDeleteItems(selected)}
          style={styles.headerIconButton}
        >
          <DeleteSvg size={20} fill={selected.length > 0 ? "gray" : "#c8c8d1"} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingBlock: 6,
    paddingInline: 12,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerRightSide: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    columnGap: 6,
  },
  headerIconButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
