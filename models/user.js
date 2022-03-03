const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    //Schema Definition for User Management
    // Following is modeled from shop project - including address/etc - we can decide what 
    // we really want to include or add from this point.

    // email: {
    //     type: String,
    //     required: true,
    // },
    // password: {
    //     type: String,
    //     required: true,
    // },
    
    // address: {
    //     details: [{
    //         firstname: {
    //             type: String,
    //             required: false,
    //         },
    //         lastname: {
    //             type: String,
    //             required: false,
    //         },
    //         street: {
    //             type: String,
    //             required: false,},
    //         line2: {
    //             type: String,
    //             required: false,
    //         },
    //         city: {
    //             type: String,
    //             required: false,
    //         },
    //         state: {
    //                 type: String,
    //                 required: false,
    //             },
    //         zip: {
    //                 type: String,
    //                 required: false,
    //             }
    //         }]
    // },
    // resetToken: String,
    // resetTokenExpiration: Date,
    // cart: {
    //     items: [{
    //         productId: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Product',
    //             required: true
    //         },
    //         quantity: {
    //             type: Number,
    //             required: true
    //         }
    //     }]
    // }
})

//Do we need to include some methods here?  

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