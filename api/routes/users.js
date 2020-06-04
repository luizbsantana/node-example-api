const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UsersController = require('../controllers/users');

router.get('/', checkAuth, UsersController.getAll);

router.post('/signup', UsersController.signup);

router.post('/login', UsersController.login);

router.delete('/:id', checkAuth, UsersController.delete);

module.exports = router;