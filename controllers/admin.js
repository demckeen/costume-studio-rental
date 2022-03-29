// ADMIN CONTROLLER

const { validationResult } = require('express-validator');
const User = require('../models/user');
const Costume = require('../models/costume');


// POST EXPORTS:

// Allows admin level users to add new costumes to the database
exports.postAddCostume = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  let admin;

  try {
    admin = await User.findById(req.userId);

    if(!admin) {
      return res.status(404).json({message: 'Unable to locate admin user'})
    }

    if(admin.admin !== true) {
      return res.status(401).json({message: 'User is not authenticated as admin'})
    }
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
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
    // JEN - I don't think we need to save the admin - this was useful when there was 
    //a product object on the user in the shop code, but not for us
    // await admin.save();
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

// Allows admin level users to edit a costume's details
exports.editCostume = async (req, res, next) => {
  const costumeId = req.body.costumeId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Edit costume failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let admin;

  try {
    admin = await User.findById(req.userId);
    if(!admin) {
      return res.status(404).json({message: 'Unable to locate admin user'})
    }
    if(admin.admin !== true) {
      return res.status(401).json({message: 'User is not authenticated as admin'})
    }
  } catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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

// Allows a costume to be deleted by admin level users only
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

    let admin;
    try {
      admin = await User.findById(req.userId);
      if(!admin) {
        return res.status(404).json({message: 'Unable to locate admin user'})
      }
      if(admin.admin !== true) {
        return res.status(401).json({message: 'User is not authenticated as admin'})
      }
    } 
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    try {
      await Costume.findByIdAndRemove(costumeId);
    }
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return res.status(500).json({message: 'Something went wrong at the costume warehouse, costume was not deleted successfully.'}, err);
    }
    return res.status(200).json({message: 'Costume has been deleted successfully!', costumeId})
  } 
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }  
}