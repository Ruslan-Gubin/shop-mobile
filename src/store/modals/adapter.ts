import { modalsStore } from "./store";

export class ModalsAdapter {
  private store = modalsStore;

  public deleteMany(ids: number[]) {
    this.store.setState({ deleteItems: ids });
  }

  public deleteItem(id: number) {
    this.store.setState({ deleteItems: [id] });
  }

  public clearDeleteItems() {
    this.store.setState({ deleteItems: [] });
  }
}

export const modalsAdapter = new ModalsAdapter();
