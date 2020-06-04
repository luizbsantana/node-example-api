const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
    Order
        .find()
        .select('_id product quantity')
        .populate('product', '_id name price image')
        .exec()
        .then(docs => {
            res.status(200).json({
                total: docs.length,
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/', checkAuth, (req, res, next) => {
    Product
        .findById(req.body.productId)
        .then(product => {
            if (!product)
                return res.status(404).json({ message: 'Product not found' });
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: `Order created successfully`,
                order: { _id: result._id, product: result.product, quantity: result.quantity }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.get('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Order
        .findById(id)
        .select('_id product quantity')
        .populate('product', '_id name price image')
        .exec()
        .then(doc => {
            if (doc)
                res.status(200).json(doc);
            else
                res.status(404).json({ message: `No valid entry found for provided id` });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ message: `Order deleted successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;