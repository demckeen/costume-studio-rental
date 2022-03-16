const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Costume = require('../models/costume');

//Place Controller functions here - exports.get/post/etc
exports.postCart = async (req, res, next) => {
  const costumeId = req.body.costumeId;

  try {
  const costume = await Product.findById(costumeId)
       await req.user.addToCart(costume);
       res.status(200).json({message: 'Costume added to cart', costumeId: costumeId, userId: req.userId})
    }
    catch(err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw error;
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const costumeId = req.body.costumeId;
  try { await  req.user.removeFromCart(costumeId);
        res.status(200).json({message: 'Costume deleted from cart', costumeId: costumeId, userId: userId})
  }
    catch(err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw error;
    }
};

exports.postOrder = async (req, res, next) => {
  try {
  const cart = await req.user.populate('cart.items.costumeId')
  const costumes = cart.items.map(i => {
        return { quantity: i.quantity, costume: { ...i.costumeId._doc } };
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
      res.status(200).json({message: 'Order placed successfully!'})
  }
    catch(err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
};


// admin Delete function? need function to send message to admin to delete?
// exports.postCancelOrder = async (req, res, next) => {
// 	const orderId = req.body.orderId;

//   try {
// 	await Order.deleteOne({ orderId: orderId, userId: req.userId })
// 			res.status(200).json({message: 'order has been deleted', orderId: orderId, userId: req.userId});
// 		}
// 		catch(err) {
// 			const error = new Error(err);
// 			error.httpStatusCode = 500;
// 			return next(error);
// 		}
// };

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