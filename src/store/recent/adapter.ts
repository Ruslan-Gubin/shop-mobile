import { recentStore } from "./store";

export class RecentAdapter {
  private store = recentStore;

  public add(id: number) {
    const items = this.store.getState().items;
    if (items[0] !== id) {
      const updateItems = [id, ...items];

      if (updateItems.length > 30) {
        updateItems.length = 30;
      }

      this.store.setState({ items: Array.from(new Set(updateItems)) });
    }
  }
}

export const recentAdapter = new RecentAdapter();
