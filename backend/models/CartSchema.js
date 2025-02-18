import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true,
    },
    name : String,
    price : String,
    image : String,
    size : String,
    color : String,
    quantity : {
        type : Number,
        default : 1
    },
}, {_id : false});

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    guestId: {
        type: String,
    },
    products : [cartItemSchema],
    totalPrice : {
        type : Number,
        default : 0,
        required : true
    },
}, {timestamps : true});

export default mongoose.model("Cart", cartSchema);