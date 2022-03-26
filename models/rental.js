// RENTAL MODEL

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  //Schema Definition for Rental Management
  costumes: [
    {
      costume: {
        type: Object, 
        required: true
      },
      quantity: {
        type: Number, 
        required: true,
      }
    }
  ],
  user: {
    email: {
      type: String, 
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    }
  }
});

module.exports = mongoose.model('Rental', rentalSchema);