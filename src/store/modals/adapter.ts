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

  public openLogin() {
    this.store.setState({ login: true });
  }

  public closeLogin() {
    this.store.setState({ login: false });
  }
}

export const modalsAdapter = new ModalsAdapter();
