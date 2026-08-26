import { createStore } from "../services/create-store";
import type { FavoritesInitState } from "./types";

export const favoritesStore = createStore<FavoritesInitState>(
  {
    items: {},
  },
  "favorites",
);
