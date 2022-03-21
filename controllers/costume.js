const fs = require('fs');
const path = require('path');
const {
  validationResult
} = require('express-validator');
const io = require('../socket');

const Costume = require('../models/costume');
const User = require('../models/user');

//Place Controller functions here - exports.get/post/etc

exports.getCostumes = async (req, res, next) => {
  const page = +req.query.page || 1;
  const perPage = 3;
  try {
    const totalItems = await Costume.find().countDocuments()
    if (!totalItems) {
      const error = new Error('No costumes found!');
      error.statusCode = 404;
      throw error;
      // return res.status(404).json({message: 'No costumes found!'})
    }
    const costumes = await Costume.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    if (!costumes) {
      const error = new Error('No costumes found!');
      error.statusCode = 404;
      throw error;
      // return res.status(404).json({message: 'No costumes found!'})
    }
    res.status(200).json({
      message: 'Fetched costumes successfully.',
      costumes: costumes,
      totalItems: totalItems
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err)
  }
};

exports.getCostume = async (req, res, next) => {
  const costumeId = req.params.costumeId;

  try {
    const costume = await Costume.findById(costumeId)
    if (!costume) {
      const error = new Error('Could not find costume');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Costume Found',
      costume: costume
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId')
    const costumes = user.cart.items;
    res.status(200)({
      pageTitle: 'Your Cart',
      costumes: costumes
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

exports.postCart = async (req, res, next) => {
  const costumeId = req.body.costumeId;

  try {
    const costume = await Product.findById(costumeId)
    await req.user.addToCart(costume);
    res.status(200).json({
      message: 'Costume added to cart',
      costumeId: costumeId,
      userId: req.userId
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    throw error;
  }
};

exports.postCartDeleteCostume = async (req, res, next) => {
  const costumeId = req.body.costumeId;
  try {
    await req.user.removeFromCart(costumeId);
    res.status(200).json({
      message: 'Costume deleted from cart',
      costumeId: costumeId,
      userId: userId
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    throw error;
  }
};

// TODO: Checkout needs fixed-please help:)
exports.getCheckout = async (req, res, next) => {
  let total = 0;

  try {
    const user = await req.user.populate('cart.items.costumeId').execPopulate()
    const costumes = user.cart.items;
    const checkoutTotal = costumes.forEach(p => {
      total += p.quantity * p.costumeId.price;
    });

    // - Dana here -- I still need to do the payments unit, I don't see where the total of
    // the order cost is getting into the checkout session? Does it need to? Where should this go?

    const paymentResult = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: costumes.map(p => {
        return {
          name: p.costumeId.title,
          description: p.costumeId.description,
          amount: p.costumeId.price * 100,
          currency: 'usd',
          quantity: p.quantity
        };
      }),
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
    })

    res.status(200).json({
      message: 'Payment processed',
      result: paymentResult
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getRentals = async (req, res, next) => {
  try {
    const rentals = rental.find({
      'user.userId': req.user._id
    });

    res.status(200)({
      pageTitle: 'Your Rentals',
      rentals: rentals
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.costumeId')
    const costumes = user.cart.items.map(i => {
      return {
        quantity: i.quantity,
        costume: {
          ...i.costumeId._doc
        }
      };

    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.userId
      },
      costumes: costumes
    });
    await order.save();
    const result = await req.user.clearCart();
    res.status(200).json({
      message: 'Order placed successfully!'
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};


// TODO: admin Delete function? need function to send message to admin to delete?
exports.postCancelOrder = async (req, res, next) => {
  const orderId = req.body.orderId;

  try {
    await Order.deleteOne({
      orderId: orderId,
      userId: req.userId
    })
    res.status(200).json({
      message: 'order has been deleted',
      orderId: orderId,
      userId: req.userId
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};