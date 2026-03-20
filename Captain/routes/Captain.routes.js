const express = require('express');
const captainController = require('../controller/user.controller');
const authMiddleware = require('../middleware/middleware');

const router = express.Router();
router.post('/register', captainController.register);
router.post('/login', captainController.login);
router.post('/logout', captainController.logout);
router.get('/profile', authMiddleware.authenticate, captainController.getProfile);
router.patch('/profile', authMiddleware.authenticate, captainController.updateProfile);

module.exports = router;

