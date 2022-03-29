// ADMIN CONTROLLER

const { validationResult } = require('express-validator');
const User = require('../models/user');
const Costume = require('../models/costume');
const { rect } = require('pdfkit');


// Place Controller functions here:

// POST EXPORTS:

// Adds new costumes
exports.postAddCostume = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const costumeName = req.body.costumeName;
  const category = req.body.category;
  const rentalFee = req.body.rentalFee;
  const size = req.body.size;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const costume = new Costume({
    costumeName: costumeName,
    category: category,
    rentalFee: rentalFee,
    size: size,
    imageUrl: imageUrl,
    description: description,
    userId: req.userId
  });
  try {
    await costume.save();
    const user = await User.findById(req.userId);
    await user.save();
    res.status(201).json({
      message: 'Costume added!',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// PUT EXPORTS:

// Allows user that added costume to edit costume
exports.editCostume = async (req, res, next) => {
  const costumeId = req.body.costumeId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Edit costume failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const costumeName = req.body.costumeName;
  const category = req.body.category;
  const rentalFee = req.body.rentalFee;
  const size = req.body.size;
  let imageUrl = req.body.imageUrl;
  const description = req.body.description;
  if (!imageUrl) {
    const error = new Error('No image specified.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const costume = await Costume.findById(costumeId);
    if (!costume) {
      const error = new Error('Could not find costume.');
      error.statusCode = 404;
      throw error;
    }
    if (!req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    costume.costumeName = costumeName,
    costume.category = category,
    costume.rentalFee = rentalFee,
    costume.size = size,
    costume.imageUrl = imageUrl,
    costume.description = description

    const result = await costume.save()
    res.status(201).json({
      message: 'Costume edited',
      costumeId: result._id
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// DELETE EXPORTS:

// Allows a costume to be deleted by user that added costume
exports.deleteCostume = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const costumeId = req.params.costumeId;
  try {
    const costume = await Costume.findById(costumeId)
    if (!costume) {
      const error = new Error('Could not find costume.');
      error.statusCode = 404;
      throw error;
    }

    const adminUser = await User.findById(req.userId);
    let isAdmin;

    if(adminUser.admin === true) {
      isAdmin = true;
    }

    if (!isAdmin) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    await Costume.findByIdAndRemove(costumeId);
    // Check logged in user
    const user = await User.findById(req.userId);

    await user.save();
    res.status(200).json({ message: 'Deleted costume.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }  
}