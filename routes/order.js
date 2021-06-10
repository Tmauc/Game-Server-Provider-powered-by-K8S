const express = require('express');

const router = express.Router();
const ordersController = require('../controllers/ordersController')
const serverController = require('../controllers/serverController')
const validationMiddleware = require('../middlewares/validationMiddleware')

router.post('/newOrder', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    ordersController.order
]);

router.post('/namespace', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    serverController.postNamespace
])

router.delete('/namespace', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    serverController.deleteNamespace
])

router.post('/namespaceDeploymentsServices', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    serverController.getNamespaceDeploymentsServices
])

router.post('/server', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    serverController.postServer
])

router.delete('/server', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    serverController.deleteServer
])

router.post('/serverLogs', [
    validationMiddleware.validJWTNeeded,
    validationMiddleware.userRoleRequired,
    serverController.getServerLogs
])

module.exports = router;