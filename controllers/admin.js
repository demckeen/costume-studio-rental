const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const io = require('../socket');
const User = require('../models/user');
const Costume = require('../models/costume');
// const user = require('../models/user');

// TODO: Remove page rendering 

// This is similar to createPost in the REST API backend feed controller
// TODO: Add image upload/download
exports.postAddCostume = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  // if (!req.file) {
  //   const error = new Error('No image provided.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  // const imageUrl = req.file.path.replace("\\" ,"/");
  const category = req.body.category;
  const costumeName = req.body.costumeName;
  const rentalFee = req.body.rentalFee;
  const size = req.body.size;
  const imageUrl = req.file.path.replace("\\" ,"/");
  const description = req.body.description;

  const costume = new Costume({
    category: category,
    costumeName: costumeName,
    rentalFee: rentalFee,
    size: size,
    image: imageUrl,
    description: description,
    userId: req.userId
  });
  try {
    await costume.save();
    // TODO: are the next 3 lines needed?
    const user = await User.findById(req.userId);
    user.costumes.push(costume);
    await user.save();
    // TODO: Stretch: add websockets. This may need to be tweaked more.
    io.getIO().emit('costumes', {
      action: 'create',
      costume: costId
    });
    res.status(201).json({
      message: 'Costume added!',
      costume: result._doc, userId: { _id: req.userId, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// This is similar to updatePost in the REST API backend feed controller but likely needs merged with the "postEditCostume" below. 
// TODO: This one primarily renders a view - does it just need changed or is it not needed at all?
exports.getEditCostume = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const costId = req.params.costumeId;
  try {
    const costume = await Costume.findById(costId);
    if (!costume) {
      const error = new Error('No costume found.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    res.render('admin/edit-costume', {
      pageTitle: 'Edit Costume',
      path: '/admin/edit-costume',
      editing: editMode,
      costume: costume,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// This is similar to updatePost in the REST API backend feed controller which is a PUT not a POST
// If the above "getEditCostume" isn't needed, this one will need to be modified more. 
// TODO: Add image upload/download
exports.postEditCostume = async (req, res, next) => {
  const costId = req.body.costumeId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Edit costume failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const updatedCategory = req.body.category;
  const updatedCostumeName = req.body.costumeName;
  const updatedRentalFee = req.body.rentalFee;
  const updatedSize = req.body.size;
  const updatedImage = req.body.image;
  const updatedDescription = req.body.description;
  // if (req.file) {
  //   imageUrl = req.file.path.replace("\\","/");
  // }
  // if (!imageUrl) {
  //   const error = new Error('No file picked.');
  //   error.statusCode = 422;
  //   throw error;
  // }

  try {
    const costume = await Costume.findById(costId);
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
    // if (imageUrl !== post.imageUrl) {
    //   clearImage(post.imageUrl);
    // }
    costume.category = updatedCategory,
    costume.costumeName = updatedCostumeName,
    costume.rentalFee = updatedRentalFee,
    costume.size = updatedSize,
    costume.image = updatedImage,
    costume.description = updatedDescription
    const result = await costume.save()
    // TODO: Stretch: add websockets
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

// This is similar to getPosts in the REST API backend feed controller
// TODO: This one may not be needed in admin. It was only rendering a view prior to async/await changes but may need for pagination
exports.getCostumes = async (req, res, next) => {
  // TODO: Stretch: add pagination
  const currentPage = req.query.page || 1;
  const perPage = 3;
  try {
    // await Costume.find({ userId: req.user._id });
    // res.status(200).json({message: 'Retrieved costumes!'})

    // TODO: Stretch: add pagination - this may be what replaces the two lines above
    const totalItems = await Costume.find().countDocuments();
    if(!totalItems) {
      return res.status(404).json({message: 'No costumes found!'})
    }
    const costumes = await Costume.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({ 
      message: 'Fetched costumes successfully.', 
      costumes: costumes,
      totalItems: totalItems
    }); 
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// This is similar to deletePost in the REST API backend feed controller
// TODO: Stretch: add websockets
exports.deleteCostume = async (req, res, next) => {
  const costId = req.params.postId;
  try {
    const costume = await Costume.findById(costId)
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
    // Check logged in user
    clearImage(costume.image);
    await Costume.findByIdAndRemove(costId);

    const user = await User.findById(req.userId);
    user.costumes.pull(costId);

    await user.save();
    io.getIO().emit('costumes', { action: 'delete', costume: costId });
    res.status(200).json({ message: 'Deleted post.' });
  } catch {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }  
}

// TODO: Add image upload/download
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};