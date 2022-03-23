// ADMIN ROUTES

const path = require('path');
const express = require('express');
const {
	body,
	check
} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// ---GET Routes---

// /admin/costumes => GET
router.get('/costumes', isAuth, adminController.getCostumes);

// /admin/add-costume => GET
// router.get('/add-costume', isAuth, adminController.getAddCostume);

// /admin/edit-costume/:costumeId => GET
router.get('/edit-costume/:costumeId', isAuth, adminController.getEditCostume);


// ---POST Routes---

// /admin/add-costume => POST
router.post(
	'/add-costume',
	[
		body('category')
		.isString()
		.isLength({
			min: 3
		})
		.trim(),
		body('name')
		.isString()
		.isLength({
			min: 3
		})
		.trim(),
		body('rentalFee').isFloat(),
		body('size')
		.isString()
		.isLength({
			min: 1
		})
		.trim(),
		body('image').isURL(),
		body('description')
		.isLength({
			min: 5,
			max: 400
		})
		.trim()
	],
	isAuth,
	adminController.postAddCostume
);


// /admin/edit-costume => POST
router.post(
	'/edit-costume',
	[
		body('category')
		.isString()
		.isLength({
			min: 3
		})
		.trim(),
		body('costumeName')
		.isString()
		.isLength({
			min: 3
		})
		.trim(),
		body('rentalFee').isFloat(),
		body('size')
		.isString()
		.isLength({
			min: 1
		})
		.trim(),
		body('image').isURL(),
		body('description')
		.isLength({
			min: 5,
			max: 400
		})
		.trim()
	],
	isAuth,
	adminController.postEditCostume
);


// ---DELETE Routes---

// /admin/delete-costume => DELETE
router.delete('/delete-costume/:costumeId', isAuth, adminController.deleteCostume);

module.exports = router;