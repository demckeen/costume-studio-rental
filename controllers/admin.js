const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Costume = require('../models/costume');

//exports.getAddCostume = (req, res, next) => {
//	res.render('admin/edit-costume', {
//	    pageTitle: 'Add Costume',
//	    path: '/admin/add-costume',
//	    editing: false,
//	    hasError: false,
//	    errorMessage: null,
//	    validationErrors: []
//	});
//};

exports.postAddCostume = (req, res, next) => {
	const category = req.body.category;
	const costumeName = req.body.costumeName;
	const rentalFee = req.body.rentalFee;
    const size = req.body.size;
    const image = req.body.image;
    const description = req.body.description;
	const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-costume', {
			pageTitle: 'Add Costume',
			path: '/admin/add-costume',
			editing: false,
			hasError: true,
			costume: {
				category: category,
				costumeName: costumeName,
				rentalFee: rentalFee,
				size: size,
				image: image,
				description: description
            },
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
        });
    }

	const costume = new Costume({
		category: category,
		costumeName: costumeName,
		rentalFee: rentalFee,
		size: size,
		image: image,
		description: description,
		userId: req.user
	});
	costume
		.save()
		.then(result => {
			console.log('Created Costume');
			res.redirect('/admin/costumes');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

//exports.getEditCostume = (req, res, next) => {
//	const editMode = req.query.edit;
//	if (!editMode) {
//		return res.redirect('/');
//	}
//	const costId = req.params.costumeId;
//	Costume.findById(costId)
//		.then(costume => {
//			if (!costume) {
//				return res.redirect('/');
//			}
//			res.render('admin/edit-costume', {
//				pageTitle: 'Edit Costume',
//				path: '/admin/edit-costume',
//				editing: editMode,
//				costume: costume,
//				hasError: false,
//				errorMessage: null,
//				validationErrors: []
//			});
//		})
//		.catch(err => {
//			const error = new Error(err);
//			error.httpStatusCode = 500;
//			return next(error);
//		});
//};

exports.postEditCostume = (req, res, next) => {
	const costId = req.body.costumeId;
	const updatedCategory = req.body.category;
	const updatedCostumeName = req.body.costumeName;
	const updatedRentalFee = req.body.rentalFee;
	const updatedSize = req.body.size;
	const updatedImage = req.body.image;
	const updatedDescription = req.body.description;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-costume', {
			pageTitle: 'Edit Costume',
			path: '/admin/edit-costume',
			editing: true,
			hasError: true,
			costume: {
				category: updatedCategory,
				costumeName: updatedCostumeName,
				rentalFee: updatedRentalFee,
				size: updatedSize,
				image: updatedImage,
				description: updatedDescription,
				_id: costId
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	Costume.findById(costId)
		.then(costume => {
			if (costume.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			costume.category: updatedCategory,
			costume.costumeName: updatedCostumeName,
			costume.rentalFee: updatedRentalFee,
			costume.size: updatedSize,
			costume.image: updatedImage,
			costume.description: updatedDescription,
			return costume.save().then(result => {
				console.log('UPDATED COSTUME!');
				res.redirect('/admin/costumes');
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

//exports.getCostumes = (req, res, next) => {
//	Costume.find({ userId: req.user._id })
//		.then(costumes => {
//			console.log(costumes);
//			res.render('admin/costumes', {
//				costs: costumes,
//				pageTitle: 'Admin Costumes',
//				path: '/admin/costumes'
//			});
//		})
//		.catch(err => {
//			const error = new Error(err);
//			error.httpStatusCode = 500;
//			return next(error);
//		});
//};

exports.postDeleteCostume = (req, res, next) => {
	const costId = req.body.costumeId;
	Costume.deleteOne({ _id: costId, userId: req.user._id })
		.then(() => {
			console.log('DESTROYED COSTUME');
			res.redirect('/admin/costumes');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};