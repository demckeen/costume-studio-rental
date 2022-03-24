// COSTUME ROUTES

const express = require('express');

const costumeController = require('../controllers/costume');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// ---GET Routes---

// /costumes => GET
router.get('/costumes', costumeController.getCostumes);

// /costume/costumes/:costumeId => GET
router.get('/costumes/:costumeId', costumeController.getCostume);

// /cart => GET
router.get('/cart', isAuth, costumeController.getCart);

// /rentals => GET
router.get('/rentals', isAuth, costumeController.getRentals);

// /rentals/:rentalId => GET
// router.get('/rentals/:rentalId', isAuth, costumeController.getInvoice);

// /checkout => GET
// router.get('/checkout', isAuth, costumeController.getCheckout);

// /checkout/success => GET
// router.get('/checkout/success', isAuth, costumeController.getCheckoutSuccess);

// /checkout/cancel => GET
// router.get('/checkout/cancel', isAuth, costumeController.getCheckout);

// ---POST Routes---

// /cart => POST
router.post('/cart', isAuth, costumeController.postCart);

// /create-rental => POST
router.post('/create-rental', isAuth, costumeController.postRental);


// ---DELETE Routes---

// /cancel-rental => DELETE
router.delete('/cancel-rental', isAuth, costumeController.postCartDeleteCostume);

module.exports = router;
