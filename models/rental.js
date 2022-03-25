// RENTAL MODEL

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// TODO: Build out schema and update schema in Swagger
const rentalSchema = new Schema({
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

// TODO: Add methods, if needed
//Do we need rental methods? 

module.exports = mongoose.model('Rental', rentalSchema);