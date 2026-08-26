import { createStore } from "../services/create-store";
import type { SearchInitState } from "./types";

export const searchStore = createStore<SearchInitState>(
  {
    history: [],
  },
  "search",
);
