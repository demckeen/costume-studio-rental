const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    //Modeled from "orders" model in Nodejs project - will require modification
    costume: [{
        // product: {type: Object, required: true},
        // quantity: {type: Number, required: true,}
    }],
    user: {
        // email: {type: String, required: true,},
        // userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
});

//Do we need rental methods? 

module.exports = mongoose.model('Retnal', rentalSchema);