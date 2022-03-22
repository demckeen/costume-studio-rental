// USER MODEL

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
userSchema.methods.addToCart = function (rental, quantity) {
    console.log(quantity);
    if(parseInt(quantity) === 0) {
        return;
    }
    else {
    const cartRentalIndex = this.cart.items.findIndex(cp => {
        return cp.rentalId.toString() === rental._id.toString();
    });
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = parseInt(this.cart.items[cartRentalIndex].quantity) + parseInt(newQuantity);
        updatedCartItems[cartRentalIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            rentalId: rental._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();}
}

userSchema.methods.removeFromCart = function(rentaltId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.rentalId.toString() !== rentalId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);