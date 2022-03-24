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
userSchema.methods.addToCart = function (costume) {
    console.log("made it to the method!", costume);
    const cartCostumeIndex = this.cart.items.findIndex(cp => {
        return cp.costumeId.toString() === costume._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartCostumeIndex >= 0) {
        newQuantity = parseInt(this.cart.items[cartCostumeIndex].quantity) + 1;
        updatedCartItems[cartCostumeIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            costumeId: costume._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function(costumeId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.costumeId.toString() !== costumeId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);