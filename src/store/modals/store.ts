import { createStore } from "../services/create-store";
import type { ModalsInitState } from "./types";

export const modalsStore = createStore<ModalsInitState>({
  deleteItems: [],
});
