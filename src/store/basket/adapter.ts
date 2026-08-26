import { basketStore } from "./store";

export class BasketAdapter {
  private store = basketStore;

  public add(id: number) {
    const items = this.store.getState().items;
    const selected = this.store.getState().selected;

    if (!Object.hasOwn(items, id)) {
      items[id] = 1;
      selected.push(id);
      const totalCount = this.getTotalCount(items);

      this.store.setState({ items: { ...items }, totalCount, selected });
    }
  }

  public delete(id: number) {
    const items = this.store.getState().items;
    const selected = this.store.getState().selected;

    if (Object.hasOwn(items, id)) {
      delete items[id];
      const updateSelected = selected.filter((el) => el !== id);
      const totalCount = this.getTotalCount(items);

      this.store.setState({ items: { ...items }, totalCount, selected: updateSelected });
    }
  }

  public decrement(id: number) {
    const items = this.store.getState().items;
    let totalCount = this.store.getState().totalCount;
    const selected = this.store.getState().selected;

    if (Object.hasOwn(items, id)) {
      const currentCount = items[id];
      const isNeedDelete = currentCount <= 1;

      if (isNeedDelete) {
        delete items[id];
        totalCount = this.getTotalCount(items);
      } else {
        items[id]--;
      }

      this.store.setState({
        items: { ...items },
        totalCount,
        selected: isNeedDelete ? selected.filter((el) => el !== id) : selected,
      });
    }
  }

  public increment(id: number) {
    const items = this.store.getState().items;

    if (Object.hasOwn(items, id)) {
      items[id]++;
      this.store.setState({ items: { ...items } });
    }
  }

  public setQuantity(id: number, quantity: number) {
    const items = this.store.getState().items;

    if (Object.hasOwn(items, id)) {
      items[id] = quantity;
      this.store.setState({ items: { ...items } });
    }
  }

  private getTotalCount(items: Record<string, number>) {
    let count = 0;

    for (const _ in items) {
      count++;
    }

    return count;
  }

  public selectToggle(id: number) {
    const selected = this.store.getState().selected;

    this.store.setState({
      selected: selected.includes(id) ? selected.filter((el) => el !== id) : [...selected, id],
    });
  }

  public selectAll() {
    const items = this.store.getState().items;
    const selected = [];

    for (const key in items) {
      selected.push(Number(key));
    }

    this.store.setState({ selected });
  }

  public cancelAll() {
    this.store.setState({ selected: [] });
  }
}

export const basketAdapter = new BasketAdapter();
