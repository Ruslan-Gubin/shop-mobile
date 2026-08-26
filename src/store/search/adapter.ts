import { searchStore } from "./store";

export class SearchAdapter {
  private store = searchStore;

  public addHistory(value: string) {
    const history = this.store.getState().history;

    if (!history.includes(value)) {
      this.store.setState({ history: [value, ...history] });
    }
  }

  public deleteHistory(value: string) {
    const history = this.store.getState().history;

    this.store.setState({ history: history.filter((el) => el !== value) });
  }

  public sortedHistory(value: string) {
    const history = this.store.getState().history;

    if (history[0] !== value) {
      const updateHistory = [value, ...history.filter((el) => el !== value)];
      this.store.setState({ history: updateHistory });
    }
  }

  public resetHistory() {
    this.store.setState({ history: [] });
  }
}

export const searchAdapter = new SearchAdapter();
