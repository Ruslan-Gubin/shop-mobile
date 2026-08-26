import { favoritesStore } from "./store";

export class FavoritesAdapter {
  private store = favoritesStore;

  public toggle(id: number) {
    const items = this.store.getState().items;

    if (!Object.hasOwn(items, id)) {
      items[id] = 1;
    } else {
      delete items[id];
    }

    this.store.setState({ items: { ...items } });
  }

  public addMany(array: number[]) {
    const items = this.store.getState().items;

    for (let i = 0; i < array.length; i++) {
      const id = array[i];
      if (!Object.hasOwn(items, id)) {
        items[id] = 1;
      }
    }

    this.store.setState({ items: { ...items } });
  }

  public cancelMany(array: number[]) {
    const items = this.store.getState().items;

    for (let i = 0; i < array.length; i++) {
      const id = array[i];
      if (Object.hasOwn(items, id)) {
        delete items[id];
      }
    }

    this.store.setState({ items: { ...items } });
  }
}

export const favoritesAdapter = new FavoritesAdapter();
