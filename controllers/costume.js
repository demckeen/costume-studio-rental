// COSTUME CONTROLLER

const {
  validationResult
} = require('express-validator');
const io = require('../socket');

const Costume = require('../models/costume');
const User = require('../models/user');
const Rental = require('../models/rental');

// Place Controller functions here:


// GET EXPORTS:

//Get the list of costumes
exports.getCostumes = async (req, res, next) => {
  const page = +req.query.page || 1;
  const perPage = 3;
  try {
    const totalItems = await Costume.find().countDocuments()
    if (!totalItems) {
      const error = new Error('No costumes found!');
      error.statusCode = 404;
      throw error;
    }
    const costumes = await Costume.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    if (!costumes) {
      const error = new Error('No costumes found!');
      error.statusCode = 404;
      throw error;
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

//Get the details of a single costume by costume id
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

// TODO: This route currently does not work.
//Get the user's cart info for added costumes in the cart
exports.getCart = async (req, res, next) => {
  const user = req.body.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    user.populate('cart.items.costumeId')
    if (!cart) {
      const error = new Error('No items in cart!');
      error.statusCode = 404;
      throw error;
    }
    const costumes = user.cart.items;
    res.status(200)({
      pageTitle: 'Your Cart',
      costumes: costumes
    }); 
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

// exports.getCart = (req, res, next) => {
//   const user = req.body.userId;
//   user
//     .populate('cart.items.costumeId')
//     // .execPopulate()
//     .then(user => {
//       const costumes = user.cart.items;
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// TODO: Checkout needs fixed-please help:)
//Get checkout information
exports.getCheckout = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  let total = 0;

  try {
    const user = await req.user.populate('cart.items.costumeId').execPopulate()
    const costumes = user.cart.items;
    const checkoutTotal = costumes.forEach(p => {
      total += p.quantity * p.costumeId.price;
    });

    // - Dana here -- I still need to do the payments unit, I don't see where the total of
    // the rental cost is getting into the checkout session? Does it need to? Where should this go?

    const paymentResult = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: costumes.map(p => {
        return {
          costumeName: p.costumeId.costumeName,
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
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// TODO: Checkout needs fixed-please help:) 
// TODO: Convert to async/await
// Gets successful checkout and clears user cart
exports.getCheckoutSuccess = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      return res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Get rentals for a user
exports.getRentals = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    const rentals = Rental.find({
      'user.userId': req.user._id
    });

    res.status(200)({
      pageTitle: 'Your Rentals',
      rentals: rentals
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

// TODO: Stretch: Invoice?
//Get invoice for rental
exports.getInvoice = async (req, res, next) => {}


// POST EXPORTS:

//Add a costume to the cart
exports.postCart = async (req, res, next) => {
  const costumeId = req.body.costumeId;
  const userId = req.body.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    const reqUser = await User.findById(userId);
    if(!reqUser) {
      const error = new Error('Cannot locate user for cart.');
      error.statusCode = 404;
      throw error;}

    console.log(req.body);
    const cartCostume = await Costume.findById(costumeId);
    if (!cartCostume) {
      console.log(costumeId)
      const error = new Error('Cannot locate costume for cart.');
      error.statusCode = 404;
      throw error;}  

    await reqUser.addToCart(cartCostume);

    res.status(200).json({
      message: 'Costume added to cart',
      costumeId: costumeId,
      userId: req.userId,
      cart: reqUser.cart.items
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// TODO: This route currently does not work. Other routes need to be working before this one can really be tested. 
//Create an order
exports.postRental = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    const user = await req.user.populate('cart.items.costumeId')
    const costumes = User.cart.items.map(i => {
      return {
        quantity: i.quantity,
        costume: {
          ...i.costumeId._doc
        }
      };

    });
    const rental = new Rental({
      user: {
        name: req.user.name,
        userId: req.userId
      },
      costumes: costumes
    });
    await rental.save();
    await req.user.clearCart();
    res.status(200).json({
      message: 'Rental placed successfully!'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// DELETE EXPORTS

// TODO: This route currently does not work. Other routes need to be working before this one can really be tested. 
//Remove costume from cart
exports.deleteCostumeFromCart = async (req, res, next) => {
  const costumeId = req.body.costumeId;
  console.log("made it to the controller!", costumeId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    await req.user.removeFromCart(costumeId);
    res.status(200).json({
      message: 'Costume deleted from cart',
      costumeId: costumeId,
      userId: userId
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}; 

// exports.deletePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   try {
//     const post = await Post.findById(postId)
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator.toString() !== req.userId) {
//       const error = new Error('Not authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     // Check logged in user
//     await Post.findByIdAndRemove(postId);

//     const user = await User.findById(req.userId);
//     user.posts.pull(postId);

//     await user.save();
//     io.getIO().emit('posts', { action: 'delete', post: postId });
//     res.status(200).json({ message: 'Deleted post.' });
//   } catch {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }  
// }

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .removeFromCart(prodId)
//     .then(result => {
//       res.redirect('/cart');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };