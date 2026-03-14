const express = require('express');
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/middleware');

const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/profile', authMiddleware.authenticate, userController.getProfile);

module.exports = router;

