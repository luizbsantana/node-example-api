const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getAll = (req, res, next) => {
    User
        .find()
        .select('_id email')
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

exports.signup = (req, res, next) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({ message: 'Email already exists' })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: `User created successfully`,
                                    product: { _id: result._id, email: result.email }
                                });
                            })
                            .catch(err => {
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        });
};

exports.login = (req, res, next) => {
    User
        .findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user)
                return res.status(404).json({ message: 'Email not found, user does not exist' });
            bcrypt.compare(req.body.password, user.password, (err, response) => {
                if (err)
                    return res.status(500).json({ error: err });
                if (response) {
                    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: '12h' });
                    return res.status(200).json({ authToken: token });
                } else
                    return res.status(404).json({ message: 'Wrong password' });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.id;
    User
        .remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ message: `User deleted successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};