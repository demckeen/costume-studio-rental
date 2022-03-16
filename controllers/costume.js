const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Costume = require('../models/costume');

//Place Controller functions here - exports.get/post/etc

exports.getCostumes = async (req, res, next) => {

  const page = +req.query.page || 1;

  try {
  const totalItems = await Costume.find()
      .countDocuments()
  const constmes = Costume.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

      res.status(200).json({
        costumes: costumes,
        totalItems: totalItems
      })}
  catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
};






//For PUT/DELETE to clear path for Image
const clearImage = filePath => {
    filePath = path.join(__dirname,'../', filePath);
    fs.unlink(filePath, err => console.log(err));
  }