const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.getAll);

router.post('/', checkAuth, OrdersController.add);

router.get('/:id', checkAuth, OrdersController.getById);

router.delete('/:id', checkAuth, OrdersController.delete);

module.exports = router;