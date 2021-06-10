const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController')

router.post('/register', authController.registerUser);
router.post('/login', authController.connectUser);

module.exports = router;