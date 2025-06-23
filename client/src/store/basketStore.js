import { makeAutoObservable } from "mobx";
import { fetchBasket } from "../components/http/basketAPI";

export default  class BasketStore {
    items = [];

    constructor() {
        makeAutoObservable(this);
    }

    get totalCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    setItems(items) {
        this.items = items;
    }
}