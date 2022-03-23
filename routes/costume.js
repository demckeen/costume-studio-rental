// COSTUME ROUTES

const path = require('path');

const express = require('express');

const {
    body,
    check
} = require('express-validator');

const costumeController = require('../controllers/costume');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// ---GET Routes---

//
router.get('/costumes', costumeController.getCostumes);

//
router.get('/costumes/:costumeId', costumeController.getCostume);

//
router.get('/cart', isAuth, costumeController.getCart);

//
// router.get('/checkout', isAuth, costumeController.getCheckout);

//
// router.get('/checkout/success', isAuth, costumeController.getCheckoutSuccess);

//
// router.get('/checkout/cancel', isAuth, costumeController.getCheckout);

//
router.get('/rentals', isAuth, costumeController.getRentals);

//
// router.get('/rentals/{rentalId}', isAuth, costumeController.getInvoice);


// ---POST Routes---

//
router.post('/cart', isAuth, costumeController.postCart);

//
router.post('/create-rental', isAuth, costumeController.postRental);


// ---DELETE Routes---

//
router.delete('/cancel-rental', isAuth, costumeController.postCartDeleteCostume);

module.exports = router;