const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Costume = require('../models/costume');

//Place Controller functions here - exports.get/post/etc
exports.postCart = (req, res, next) => {
  const costumeId = req.body.costumeId;
  Product.findById(costumeId)
    .then(costume => {
      return req.user.addToCart(costume);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const costumeId = req.body.costumeId;
  req.user
    .removeFromCart(costumeId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.costumeId')
    //.execPopulate()
    .then(user => {
      const costumes = user.cart.items.map(i => {
        return { quantity: i.quantity, costume: { ...i.costumeId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        costumes: costumes
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/rentals');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCancelOrder = (req, res, next) => {
	const costumeId = req.body.costumeId;
	Order.deleteOne({ costumeId: costumeId, userId: req.user._id })
		.then(() => {
			console.log('Order Cancelled');
			res.redirect('/rentals');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

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