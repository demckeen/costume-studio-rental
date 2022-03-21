const path = require('path');

const express = require('express');

const {
    body,
    check
} = require('express-validator');

const inventoryController = require('../controllers/costume');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//Place routes here

//get costumes
router.get('/costumes', inventoryController.getCostumes);

//
router.get('/costumes/:costumeId', inventoryController.getCostume);

//
router.get('/cart', isAuth, inventoryController.getCart);

//
router.get('/checkout', isAuth, inventoryController.getCheckout);

//
// router.get('/checkout/success', isAuth, inventoryController.getCheckoutSuccess);

//
// router.post('/checkout/cancel', isAuth, inventoryController.cancelCheckout);

//
router.get('/orders', isAuth, inventoryController.getOrders);

//Post routes

//
router.post('/cart', isAuth, inventoryController.postCart);

//
router.post('/cancel-rental', isAuth, inventoryController.postCartDeleteCostume);

//
router.post('/create-rental', isAuth, inventoryController.postOrder);

//
router.post('/cancel-rental', isAuth, inventoryController.postCancelOrder);

module.exports = router;