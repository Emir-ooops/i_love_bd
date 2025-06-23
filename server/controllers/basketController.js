const ApiError = require('../error/ApiError');
const {Basket, Basket_item, Item} = require('../models/models');

class BasketController {
    async getBasket(req, res, next) {
        try {
            const {id} = req.user;

            const basket = await Basket.findOne({
                where: {userId: id},
                include: [{
                    model: Basket_item,
                    include: [Item]
                }]
            });

            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }

            return res.json(basket);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async addItem(req, res, next) {
        try {
            const {id} = req.user;
            const {itemId, quantity = 1} = req.body;

            // Валидация количества
            if (quantity < 1) {
                return next(ApiError.badRequest('Количество не может быть меньше 1'));
            }

            const basket = await Basket.findOne({where: {userId: id}});
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }

            const existingItem = await Basket_item.findOne({
                where: {
                    basketId: basket.id,
                    itemId
                }
            });

            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save();
            } else {
                await Basket_item.create({
                    basketId: basket.id,
                    itemId,
                    quantity
                });
            }

            const updatedBasket = await Basket.findOne({
                where: {userId: id},
                include: [{
                    model: Basket_item,
                    include: [Item]
                }]
            });

            return res.json(updatedBasket);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async removeItem(req, res, next) {
        try {
            const {id} = req.user;
            const {itemId} = req.params;

            const basket = await Basket.findOne({where: {userId: id}});
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }

            await Basket_item.destroy({
                where: {
                    basketId: basket.id,
                    itemId
                }
            });

            const updatedBasket = await Basket.findOne({
                where: {userId: id},
                include: [{
                    model: Basket_item,
                    include: [Item]
                }]
            });

            return res.json(updatedBasket);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateQuantity(req, res, next) {
        try {
            const {id} = req.user;
            const {itemId, quantity} = req.body;

            if (quantity < 1) {
                return next(ApiError.badRequest('Количество не может быть меньше 1'));
            }

            const basket = await Basket.findOne({where: {userId: id}});
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }

            const basketItem = await Basket_item.findOne({
                where: {
                    basketId: basket.id,
                    itemId
                }
            });

            if (!basketItem) {
                return next(ApiError.badRequest('Товар не найден в корзине'));
            }

            basketItem.quantity = quantity;
            await basketItem.save();

            const updatedBasket = await Basket.findOne({
                where: {userId: id},
                include: [{
                    model: Basket_item,
                    include: [Item]
                }]
            });

            return res.json(updatedBasket);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async clearBasket(req, res, next) {
        try {
            const {id} = req.user;

            const basket = await Basket.findOne({where: {userId: id}});
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }

            await Basket_item.destroy({
                where: {
                    basketId: basket.id
                }
            });

            return res.json({message: 'Корзина очищена'});
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new BasketController();