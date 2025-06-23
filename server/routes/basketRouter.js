const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, basketController.addItem); // POST /api/basket/add
router.get('/', authMiddleware, basketController.getBasket);
router.delete('/remove/:itemId', authMiddleware, basketController.removeItem);
router.put('/update', authMiddleware, basketController.updateQuantity);
router.delete('/clear', authMiddleware, basketController.clearBasket);

module.exports = router;