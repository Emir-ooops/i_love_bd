import { $authHost } from "./index";

export const fetchBasket = async () => {
    const {data} = await $authHost.get('api/basket');
    return data;
}

export const addToBasket = async (itemId) => {
    const {data} = await $authHost.post('api/basket/add', {itemId});
    return data;
}

export const removeFromBasket = async (itemId) => {
    const {data} = await $authHost.delete(`api/basket/remove/${itemId}`);
    return data;
}

export const updateBasketItem = async (itemId, quantity) => {
    const {data} = await $authHost.put('api/basket/update', {itemId, quantity});
    return data;
}

export const clearBasket = async () => {
    const {data} = await $authHost.delete('api/basket/clear');
    return data;
}