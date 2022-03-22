const path = require('path');

const express = require('express');

const {
    body,
    check
} = require('express-validator');

const costumeController = require('../controllers/costume');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//Place routes here

//get costumes
router.get('/costumes', costumeController.getCostumes);

//
router.get('/costumes/:costumeId', costumeController.getCostume);

//
router.get('/cart', isAuth, costumeController.getCart);

//
router.get('/checkout', isAuth, costumeController.getCheckout);

//
// router.get('/checkout/success', isAuth, costumeController.getCheckoutSuccess);

//
// router.post('/checkout/cancel', isAuth, costumeController.cancelCheckout);

//
router.get('/rentals', isAuth, costumeController.getRentals);

//Post routes

//
router.post('/cart', isAuth, costumeController.postCart);

//
router.post('/cancel-rental', isAuth, costumeController.postCartDeleteCostume);

//
router.post('/create-rental', isAuth, costumeController.postRental);

//
router.post('/cancel-rental', isAuth, costumeController.postCancelRental);

module.exports = router;