// ADMIN CONTROLLER

const { validationResult } = require('express-validator');
const io = require('../socket');
const User = require('../models/user');
const Costume = require('../models/costume');

// TODO: Remove any page rendering 
// Place Controller functions here:

// GET EXPORTS:

// TODO: Delete this route before turning in project
// Displays costumes to user with admin capabilities
exports.getCostumes = async (req, res, next) => {

  try {
    const costumes = await Costume.find()
    res.status(200).json({ 
      message: 'Fetched costumes successfully.', 
      costumes: costumes,
    }); 
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// POST EXPORTS:

// This is similar to createPost in the REST API backend feed controller
// Adds new costumes
exports.postAddCostume = async (req, res, next) => {
  // TODO: When we know how to test with Authorization, uncomment out errors code (lines 159-165)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }


  const category = req.body.category;
  const costumeName = req.body.costumeName;
  const rentalFee = req.body.rentalFee;
  const size = req.body.size;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const costume = new Costume({
    category: category,
    costumeName: costumeName,
    rentalFee: rentalFee,
    size: size,
    imageUrl: imageUrl,
    description: description,
    userId: req.userId
  });
  try {
    await costume.save();
    const user = await User.findById(req.userId);
    // user.costumes.push(costume);
    await user.save();
    // TODO: Stretch: add websockets? This may need to be tweaked more.
    // io.getIO().emit('costumes', {
    //   action: 'create',
    //   costume: costumeId
    // });
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

// This is similar to updatePost in the REST API backend feed controller
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
  const category = req.body.category;
  const costumeName = req.body.costumeName;
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
    // if (costume.creator._id.toString() !== req.userId) {
    //   const error = new Error('Not authorized!');
    //   error.statusCode = 403;
    //   throw error;
    // }

    costume.category = category,
    costume.costumeName = costumeName,
    costume.rentalFee = rentalFee,
    costume.size = size,
    costume.imageUrl = imageUrl,
    costume.description = description

    const result = await costume.save()
    // TODO: Stretch: add websockets?
    // io.getIO().emit('posts', { action: 'update', post: result });
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

// This is similar to deletePost in the REST API backend feed controller
// Allows a costume to be deleted by user that added costume
exports.deleteCostume = async (req, res, next) => {
    // TODO: When we know how to test with Authorization, uncomment out errors code (lines 200-206)
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
    if (costume.userId.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    await Costume.findByIdAndRemove(costumeId);
    // Check logged in user
    const user = await User.findById(req.userId);

    await user.save();
    io.getIO().emit('costumes', { action: 'delete', costume: costumeId });
    res.status(200).json({ message: 'Deleted costume.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }  
}