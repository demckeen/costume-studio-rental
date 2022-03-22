const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    //Schema Definition for User Management

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: false,
    },
    cart: {
        items: [{
            costumeId: {
                type: Schema.Types.ObjectId,
                ref: 'Costume',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

//Sample Method: 
// userSchema.methods.addToCart = function (product, quantity) {
//     console.log(quantity);
//     if(parseInt(quantity) === 0) {
//         return;
//     }
//     else {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//         return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = quantity;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//         newQuantity = parseInt(this.cart.items[cartProductIndex].quantity) + parseInt(newQuantity);
//         updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//         updatedCartItems.push({
//             productId: product._id,
//             quantity: newQuantity
//         });
//     }
//     const updatedCart = {
//         items: updatedCartItems
//     };
//     this.cart = updatedCart;
//     return this.save();}

// }

module.exports = mongoose.model('User', userSchema);