const express = require('express');

const router = express.Router();
const adminController = require('../controllers/adminController')

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.connectAdmin);
router.get('/users', adminController.getUsers);
router.post('/user', adminController.getUser);

module.exports = router;