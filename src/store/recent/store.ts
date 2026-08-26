import { createStore } from "../services/create-store";
import type { RecentInitState } from "./types";

export const recentStore = createStore<RecentInitState>(
  {
    items: [],
  },
  "recent",
);
