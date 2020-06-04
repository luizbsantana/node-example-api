const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAll = (req, res, next) => {
    Product
        .find()
        .select('_id name price image')
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
};

exports.add = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        image: req.file ? req.file.path : ''
    });
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: `Product created successfully`,
                product: { _id: result._id, name: result.name, price: result.price, image: result.image }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.getById = (req, res, next) => {
    const id = req.params.id;
    Product
        .findById(id)
        .select('_id name price image')
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
};

exports.put = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Product updated successfully`,
                product: { _id: result._id, name: result.name, price: result.price, image: result.image }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.id;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ message: `Product deleted successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};