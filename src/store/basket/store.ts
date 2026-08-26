import { createStore } from "../services/create-store";
import type { BasketInitState } from "./types";

export const basketStore = createStore<BasketInitState>(
  {
    items: {},
    totalCount: 0,
    selected: [],
  },
  "basket",
);
