const express = require('express');

const router = express.Router();
const userController = require('../controllers//userController')
const validationMiddleware = require('../middlewares/validationMiddleware')

router.get('/user', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    userController.getUser]);

router.delete('/user', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.adminRoleRequired,
    userController.deleteUser]);

module.exports = router;