const express = require('express');

const router = express.Router();
const productController = require('../controllers/productsController')
const validationMiddleware = require('../middlewares/validationMiddleware')

router.post('/product', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.adminRoleRequired,
    productController.newProduct
]
);
router.get('/product', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    productController.getProduct
]);
router.get('/products', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    productController.getProducts
]);

module.exports = router;