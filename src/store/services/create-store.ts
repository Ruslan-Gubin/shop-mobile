import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const persistMiddleware = (initState: any, persistName?: string) => {
  return !persistName
    ? initState
    : persist(initState, {
        name: persistName,
        storage: createJSONStorage(() => AsyncStorage),
      });
};

export const createStore = <T>(initState: T, persistName?: string) =>
  create<T>()(immer(persistMiddleware(() => initState, persistName)));
