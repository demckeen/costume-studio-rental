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
    const costumes = Costume.find()
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

exports.getCostume = (req, res, next) => {
  const costumeId = req.params.costumeId;
  Costume.findById(costumeId)
    .then(costume => {
      if (!costume) {
        const error = new Error('Could not find costume');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Costume Found', costume: costume });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const costumes = user.cart.items;
      res.status(200)({ 
        pageTitle: 'Your Cart',
        costumes: costumes
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Checkout needs fixed-please help:)
exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.status(200)({ 
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};





//For PUT/DELETE to clear path for Image
const clearImage = filePath => {
    filePath = path.join(__dirname,'../', filePath);
    fs.unlink(filePath, err => console.log(err));
  }