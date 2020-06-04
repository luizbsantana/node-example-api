const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
};
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });

const Product = require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
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
});

router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
    console.log(req.userData);
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
});

router.get('/:id', checkAuth, (req, res, next) => {
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
});

router.put('/:id', checkAuth, (req, res, next) => {
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
});

router.delete('/:id', checkAuth, (req, res, next) => {
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
});

module.exports = router;